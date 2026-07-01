from enum import Enum
from typing import Literal, Optional
from dotenv import load_dotenv

_RED = "\033[91m"
_RESET = "\033[0m"
from langchain.agents import create_agent
from langchain.tools import tool
from langgraph.checkpoint.memory import InMemorySaver
from pymongo import MongoClient

load_dotenv()

_client = MongoClient("mongodb://localhost/lol_chatbot")
_champions = _client["lol_chatbot"]["champions"]

# Indexes for role/position filters and attribute-rating scans
_champions.create_index("roles")
_champions.create_index("positions")
for _attr in ("damage", "toughness", "control", "mobility", "utility", "difficulty", "abilityReliance"):
    _champions.create_index(f"attributeRatings.{_attr}")

class InfoField(str, Enum):
    positions = "positions"
    roles = "roles"
    adaptiveType = "adaptiveType"
    resource = "resource"
    lore = "lore"
    attributeRatings = "attributeRatings"
    key = "key"
    id = "id"
    title = "title"


class StatName(str, Enum):
    health = "health"
    mana = "mana"
    armor = "armor"
    magicResistance = "magicResistance"
    attackDamage = "attackDamage"
    attackSpeed = "attackSpeed"
    movespeed = "movespeed"
    attackRange = "attackRange"
    healthRegen = "healthRegen"
    manaRegen = "manaRegen"
    criticalStrikeDamage = "criticalStrikeDamage"
    criticalStrikeDamageModifier = "criticalStrikeDamageModifier"


class AttributeRating(str, Enum):
    damage = "damage"
    toughness = "toughness"
    control = "control"
    mobility = "mobility"
    utility = "utility"
    difficulty = "difficulty"
    abilityReliance = "abilityReliance"


class Role(str, Enum):
    FIGHTER = "FIGHTER"
    TANK = "TANK"
    MAGE = "MAGE"
    ASSASSIN = "ASSASSIN"
    SUPPORT = "SUPPORT"
    MARKSMAN = "MARKSMAN"
    DIVER = "DIVER"
    ENCHANTER = "ENCHANTER"
    BURST = "BURST"
    POKE = "POKE"
    WARDEN = "WARDEN"
    SKIRMISHER = "SKIRMISHER"
    SPECIALIST = "SPECIALIST"
    CATCHER = "CATCHER"


class Position(str, Enum):
    TOP = "TOP"
    JUNGLE = "JUNGLE"
    MID = "MID"
    BOTTOM = "BOTTOM"
    SUPPORT = "SUPPORT"


def _load_champion(name: str) -> dict:
    doc = _champions.find_one({"key": name}, {"_id": 0})
    if doc is None:
        print(f"{_RED}Champion '{name}' not found in database.{_RESET}")
        return {}
    return doc


def _load_tool_description(name: str) -> str:
    with open(f"tool_descriptions/{name}.txt", "r", encoding="utf-8") as f:
        return f.read()


def _compute_leveled_stat(stat_obj: dict, stat_name: str, level: int) -> float:
    flat = stat_obj.get("flat", 0.0)
    per_level = stat_obj.get("perLevel", 0.0)
    # attackSpeed perLevel is a percent bonus per level, not a flat addition
    if stat_name == "attackSpeed":
        return flat * (1 + per_level * (level - 1) / 100)
    return flat + per_level * (level - 1)


def _build_mongo_filter(filters: Optional[dict]) -> dict:
    query: dict = {}
    if not filters:
        return query
    if "role" in filters:
        query["roles"] = filters["role"]
    if "position" in filters:
        query["positions"] = filters["position"]
    return query


@tool("get_champion_info", description=_load_tool_description("get_champion_info"))
def get_champion_info(name: str, fields: list[InfoField]) -> dict:
    print(f"[tool] get_champion_info(name={name!r}, fields={fields!r})")
    doc = _load_champion(name)
    missing = [f for f in fields if f not in doc]
    if missing:
        print(f"{_RED}Fields not present for champion '{name}': {missing}{_RESET}")
        return {}
    return {f: doc[f] for f in fields}


@tool("get_champion_stat", description=_load_tool_description("get_champion_stat"))
def get_champion_stat(name: str, stat_name: StatName, at_level: int = 1) -> float:
    print(f"[tool] get_champion_stat(name={name!r}, stat_name={stat_name!r}, at_level={at_level!r})")
    if not 1 <= at_level <= 18:
        print(f"{_RED}at_level must be 1–18, got {at_level}{_RESET}")
        return None
    doc = _load_champion(name)
    stat_obj = doc.get("stats", {}).get(stat_name)
    if stat_obj is None:
        print(f"{_RED}Stat '{stat_name}' not found for champion '{name}'{_RESET}")
        return None
    return _compute_leveled_stat(stat_obj, stat_name, at_level)


@tool("scan_stats", description=_load_tool_description("scan_stats"))
def scan_stats(
    stat_name: StatName,
    order: str,
    limit: int,
    offset: int = 0,
    at_level: int = 1,
    min_value: Optional[float] = None,
    max_value: Optional[float] = None,
    min_exclusive: Optional[float] = None,
    max_exclusive: Optional[float] = None,
    roles: Optional[list[Role]] = None,
    roles_mode: Literal["any", "all"] = "any",
    positions: Optional[list[Position]] = None,
    positions_mode: Literal["any", "all"] = "any",
) -> list:
    print(f"[tool] scan_stats(stat_name={stat_name!r}, order={order!r}, limit={limit!r}, offset={offset!r}, at_level={at_level!r}, min_value={min_value!r}, max_value={max_value!r}, min_exclusive={min_exclusive!r}, max_exclusive={max_exclusive!r}, roles={roles!r}, roles_mode={roles_mode!r}, positions={positions!r}, positions_mode={positions_mode!r})")
    if order not in ("highest", "lowest"):
        print(f"{_RED}order must be 'highest' or 'lowest', got '{order}'{_RESET}")
        return []
    if not 1 <= at_level <= 18:
        print(f"{_RED}at_level must be 1–18, got {at_level}{_RESET}")
        return []

    query: dict = {}
    if roles:
        op = "$all" if roles_mode == "all" else "$in"
        query["roles"] = {op: [r.value for r in roles]}
    if positions:
        op = "$all" if positions_mode == "all" else "$in"
        query["positions"] = {op: [p.value for p in positions]}
    docs = list(_champions.find(query, {"_id": 0, "key": 1, f"stats.{stat_name.value}": 1}))
    results = []
    for doc in docs:
        stat_obj = doc.get("stats", {}).get(stat_name.value)
        if stat_obj is None:
            continue
        value = _compute_leveled_stat(stat_obj, stat_name, at_level)
        if min_value is not None and value < min_value:
            continue
        if max_value is not None and value > max_value:
            continue
        if min_exclusive is not None and value <= min_exclusive:
            continue
        if max_exclusive is not None and value >= max_exclusive:
            continue
        results.append({"name": doc["key"], "value": value})

    results.sort(key=lambda x: x["value"], reverse=(order == "highest"))
    return results[offset:offset + limit]


@tool("scan_attribute_ratings", description=_load_tool_description("scan_attribute_ratings"))
def scan_attribute_ratings(
    attribute: AttributeRating,
    order: Optional[str],
    limit: int,
    min_value: Optional[int] = None,
    max_value: Optional[int] = None,
    filters: Optional[dict] = None,
) -> list:
    print(f"[tool] scan_attribute_ratings(attribute={attribute!r}, order={order!r}, limit={limit!r}, min_value={min_value!r}, max_value={max_value!r}, filters={filters!r})")
    if order is not None and order not in ("highest", "lowest"):
        print(f"{_RED}order must be 'highest', 'lowest', or None, got '{order}'{_RESET}")
        return []

    query = _build_mongo_filter(filters)
    rating_range: dict = {}
    if min_value is not None:
        rating_range["$gte"] = min_value
    if max_value is not None:
        rating_range["$lte"] = max_value
    if rating_range:
        query[f"attributeRatings.{attribute}"] = rating_range

    docs = list(_champions.find(query, {"_id": 0, "key": 1, f"attributeRatings.{attribute}": 1}))

    results = []
    for doc in docs:
        value = doc.get("attributeRatings", {}).get(attribute)
        if value is None:
            continue
        results.append({"name": doc["key"], "value": value})

    if order is not None:
        results.sort(key=lambda x: x["value"], reverse=(order == "highest"))

    return results[:limit]


@tool(
    "get_champion_ability",
    description=_load_tool_description("get_champion_ability"),
)
def get_champion_ability(
    champion_name: str, slot: Literal["P", "Q", "W", "E", "R"]
) -> dict:
    print(f"[tool] get_champion_ability(champion_name={champion_name!r}, slot={slot!r})")
    data = _load_champion(champion_name)
    return data["abilities"][slot][0]


@tool(
    "get_champion_skins",
    description=(
        "Returns the full skins list for a League of Legends champion, including "
        "skin names, costs, rarity, chromas, lore, and splash art URLs. "
        "Only call this tool when the user explicitly asks about skins — the payload "
        "is large. "
        "The `name` argument must be the champion's key exactly as it appears in the "
        "file name, e.g. 'Warwick', 'Ahri', 'MissFortune'."
    ),
)
def get_champion_skins(name: str) -> list:
    print(f"[tool] get_champion_skins(name={name!r})")
    data = _load_champion(name)
    return data["skins"]


from langchain.chat_models import init_chat_model
from langchain.messages import HumanMessage, AIMessage


# Hosted
# model = init_chat_model(model="anthropic:claude-haiku-4-5", temperature=0)
# model = init_chat_model(model="openai:gpt-4.1-mini", temperature=0)
# model = init_chat_model(model="openai:gpt-5-mini", temperature=0)
# model = init_chat_model(model="google_genai:gemini-2.5-flash", temperature=0)
model = init_chat_model(model="ollama:qwen3:14b", temperature=0,reasoning=False)
checkpointer = InMemorySaver()

with open("system_prompt.txt", "r", encoding="utf-8") as f:
    system_prompt = f.read()

agent = create_agent(
    model=model,
    tools=[
        get_champion_info,
        get_champion_stat,
        scan_stats,
        scan_attribute_ratings,
        get_champion_ability,
        get_champion_skins,
    ],
    system_prompt=system_prompt,
    # checkpointer=checkpointer,
)

conversation = []

while True:
    question = input("You: ")
    if question.strip().lower() == "exit":
        break

    conversation.append(HumanMessage(question))
    result = agent.invoke({"messages": conversation})
    answer = result["messages"][-1].content
    print(f"Bot: {answer}")
    conversation.append(AIMessage(answer))
