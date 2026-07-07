from pathlib import Path
from typing import Optional
from pymongo import MongoClient
from langchain_ollama import OllamaEmbeddings
import chromadb
from enums import StatName

_RED = "\033[91m"
_RESET = "\033[0m"

_client = MongoClient("mongodb://localhost/lol_chatbot")
_champions = _client["lol_chatbot"]["champions"]

_champions.create_index("roles")
_champions.create_index("positions")
for _attr in ("damage", "toughness", "control", "mobility", "utility", "difficulty", "abilityReliance"):
    _champions.create_index(f"attributeRatings.{_attr}")

_chroma_client = chromadb.PersistentClient(path=str(Path(__file__).parent / "chroma"))
_abilities_collection = _chroma_client.get_or_create_collection(name="champion_abilities")
_embeddings = OllamaEmbeddings(model="nomic-embed-text")


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


def _ability_numeric_at_rank(obj: Optional[dict], rank: int) -> Optional[float]:
    if obj is None:
        return None
    modifiers = obj.get("modifiers", [])
    if not modifiers:
        return None
    values = modifiers[0].get("values", [])
    idx = rank - 1
    if idx < 0 or idx >= len(values):
        return None
    try:
        return float(values[idx])
    except (TypeError, ValueError):
        return None


def _ability_numeric_passes_any(
    obj: Optional[dict],
    min_inc: Optional[float],
    max_inc: Optional[float],
    min_ex: Optional[float],
    max_ex: Optional[float],
) -> bool:
    if obj is None:
        return False
    modifiers = obj.get("modifiers", [])
    if not modifiers:
        return False
    for v in modifiers[0].get("values", []):
        try:
            f = float(v)
        except (TypeError, ValueError):
            continue
        if min_inc is not None and f < min_inc:
            continue
        if max_inc is not None and f > max_inc:
            continue
        if min_ex is not None and f <= min_ex:
            continue
        if max_ex is not None and f >= max_ex:
            continue
        return True
    return False


def _build_mongo_filter(filters: Optional[dict]) -> dict:
    query: dict = {}
    if not filters:
        return query
    if "role" in filters:
        query["roles"] = filters["role"]
    if "position" in filters:
        query["positions"] = filters["position"]
    return query
