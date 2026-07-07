import json
from pathlib import Path

from langchain_ollama import OllamaEmbeddings
import chromadb

CHAMPIONS_FILE = Path(__file__).parent / "json" / "champions.json"
CHROMA_PATH = Path(__file__).parent / "chroma"
COLLECTION_NAME = "champion_abilities"
SLOTS = ["P", "Q", "W", "E", "R"]

embeddings = OllamaEmbeddings(model="nomic-embed-text")


def _build_description(ability: dict) -> str:
    return " ".join(
        effect["description"]
        for effect in ability.get("effects", [])
        if effect.get("description")
    )


def seed():
    print(f"Reading champions from {CHAMPIONS_FILE} ...")
    with open(CHAMPIONS_FILE, encoding="utf-8") as f:
        data = json.load(f)

    chroma_client = chromadb.PersistentClient(path=str(CHROMA_PATH))
    collection = chroma_client.get_or_create_collection(name=COLLECTION_NAME)

    ids = []
    documents = []
    metadatas = []

    for champion in data.values():
        champion_name = champion["key"]
        abilities = champion.get("abilities", {})
        for slot in SLOTS:
            ability_list = abilities.get(slot)
            if not ability_list:
                continue
            ability = ability_list[0]
            description = _build_description(ability)
            if not description:
                continue
            ids.append(f"{champion_name}_{slot}")
            documents.append(description)
            metadatas.append({
                "champion": champion_name,
                "slot": slot,
                "ability_name": ability.get("name", ""),
            })

    print(f"Embedding {len(ids)} abilities ...")
    embedded = embeddings.embed_documents(documents)

    collection.add(
        ids=ids,
        embeddings=embedded,
        documents=documents,
        metadatas=metadatas,
    )
    print(f"Done. Seeded {len(ids)} ability records into '{COLLECTION_NAME}'.")


if __name__ == "__main__":
    seed()
