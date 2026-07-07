from typing import Literal, Optional, Union
from langchain.tools import tool
from enums import (
    AbilityField, Targeting, Affects, DamageType, Resource,
    InfoField, StatName, AttributeRating, Role, Position,
)
from db import (
    _RED, _RESET,
    _champions,
    _abilities_collection, _embeddings,
    _load_champion, _load_tool_description,
    _compute_leveled_stat,
    _ability_numeric_at_rank, _ability_numeric_passes_any,
    _build_mongo_filter,
)


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


@tool("get_champion_ability", description=_load_tool_description("get_champion_ability"))
def get_champion_ability(
    champion_name: str, slot: Literal["P", "Q", "W", "E", "R"]
) -> dict:
    print(f"[tool] get_champion_ability(champion_name={champion_name!r}, slot={slot!r})")
    data = _load_champion(champion_name)
    return data["abilities"][slot][0]


@tool("scan_abilities", description=_load_tool_description("scan_abilities"))
def scan_abilities(
    limit: int = 1,
    offset: int = 0,
    fields: Optional[list[AbilityField]] = None,
    slot: Optional[Literal["P", "Q", "W", "E", "R"]] = None,
    targeting: Optional[Targeting] = None,
    affects: Optional[Affects] = None,
    damage_type: Optional[DamageType] = None,
    resource: Optional[Resource] = None,
    spellshieldable: Optional[bool] = None,
    projectile: Optional[bool] = None,
    at_rank: Union[int, Literal["any"]] = 1,
    cooldown_min: Optional[float] = None,
    cooldown_max: Optional[float] = None,
    cooldown_min_exclusive: Optional[float] = None,
    cooldown_max_exclusive: Optional[float] = None,
    cost_min: Optional[float] = None,
    cost_max: Optional[float] = None,
    cost_min_exclusive: Optional[float] = None,
    cost_max_exclusive: Optional[float] = None,
    name_contains: Optional[str] = None,
) -> list:
    print(f"[tool] scan_abilities(slot={slot!r}, targeting={targeting!r}, affects={affects!r}, damage_type={damage_type!r}, resource={resource!r}, spellshieldable={spellshieldable!r}, projectile={projectile!r}, at_rank={at_rank!r}, limit={limit!r}, offset={offset!r})")

    slots = [slot] if slot else ["P", "Q", "W", "E", "R"]
    docs = list(_champions.find({}, {"_id": 0, "key": 1, "abilities": 1}))
    field_names = {f.value for f in fields} if fields else None

    results = []
    for doc in docs:
        champion_name = doc["key"]
        abilities_data = doc.get("abilities", {})
        for s in slots:
            ability_list = abilities_data.get(s)
            if not ability_list:
                continue

            passing = []
            for ab in ability_list:
                if targeting is not None:
                    val = ab.get("targeting")
                    if not val or targeting.value.lower() not in val.lower():
                        continue

                if affects is not None:
                    val = ab.get("affects")
                    if not val or affects.value.lower() not in val.lower():
                        continue

                if damage_type is not None:
                    if ab.get("damageType") != damage_type.value:
                        continue

                if resource is not None:
                    if ab.get("resource") != resource.value:
                        continue

                if spellshieldable is not None:
                    val = ab.get("spellshieldable")
                    expected = "true" if spellshieldable else "false"
                    if val is None or str(val).lower() != expected:
                        continue

                if projectile is not None:
                    val = ab.get("projectile")
                    expected = "true" if projectile else "false"
                    if val is None or str(val).lower() != expected:
                        continue

                if name_contains is not None:
                    val = ab.get("name") or ""
                    if name_contains.lower() not in val.lower():
                        continue

                if at_rank == "any":
                    if any(x is not None for x in [cooldown_min, cooldown_max, cooldown_min_exclusive, cooldown_max_exclusive]):
                        if not _ability_numeric_passes_any(ab.get("cooldown"), cooldown_min, cooldown_max, cooldown_min_exclusive, cooldown_max_exclusive):
                            continue
                else:
                    cd = _ability_numeric_at_rank(ab.get("cooldown"), at_rank)
                    if cooldown_min is not None and (cd is None or cd < cooldown_min):
                        continue
                    if cooldown_max is not None and (cd is None or cd > cooldown_max):
                        continue
                    if cooldown_min_exclusive is not None and (cd is None or cd <= cooldown_min_exclusive):
                        continue
                    if cooldown_max_exclusive is not None and (cd is None or cd >= cooldown_max_exclusive):
                        continue

                if at_rank == "any":
                    if any(x is not None for x in [cost_min, cost_max, cost_min_exclusive, cost_max_exclusive]):
                        if not _ability_numeric_passes_any(ab.get("cost"), cost_min, cost_max, cost_min_exclusive, cost_max_exclusive):
                            continue
                else:
                    c = _ability_numeric_at_rank(ab.get("cost"), at_rank)
                    if cost_min is not None and (c is None or c < cost_min):
                        continue
                    if cost_max is not None and (c is None or c > cost_max):
                        continue
                    if cost_min_exclusive is not None and (c is None or c <= cost_min_exclusive):
                        continue
                    if cost_max_exclusive is not None and (c is None or c >= cost_max_exclusive):
                        continue

                if field_names is not None:
                    ab = {k: v for k, v in ab.items() if k in field_names}
                passing.append(ab)

            if passing:
                results.append({"champion_name": champion_name, "slot": s, "ability": passing})

    return results[offset : offset + limit]


@tool("search_abilities", description=_load_tool_description("search_abilities"))
def search_abilities(query: str, limit: int = 5) -> list[dict]:
    print(f"[tool] search_abilities(query={query!r}, limit={limit!r})")
    query_embedding = _embeddings.embed_query(query)
    results = _abilities_collection.query(
        query_embeddings=[query_embedding],
        n_results=limit,
    )
    print(results)
    return results["metadatas"][0]


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
