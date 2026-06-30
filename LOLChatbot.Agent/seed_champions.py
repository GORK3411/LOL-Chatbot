import json
import sys
import urllib.request
from pathlib import Path

from pymongo import MongoClient, UpdateOne

MONGO_URI = "mongodb://localhost/lol_chatbot"
DB_NAME = "lol_chatbot"
COLLECTION = "champions"

LOCAL_FILE = Path(__file__).parent / "json" / "champions.json"
REMOTE_URL = "https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json"


def load_data(use_remote: bool) -> dict:
    if use_remote:
        print(f"Fetching from {REMOTE_URL} ...")
        with urllib.request.urlopen(REMOTE_URL) as response:
            return json.loads(response.read())
    else:
        print(f"Reading from {LOCAL_FILE} ...")
        with open(LOCAL_FILE, encoding="utf-8") as f:
            return json.load(f)


def seed(use_remote: bool = False):
    data = load_data(use_remote)

    client = MongoClient(MONGO_URI)
    collection = client[DB_NAME][COLLECTION]

    ops = [
        UpdateOne({"id": champion["id"]}, {"$set": champion}, upsert=True)
        for champion in data.values()
    ]

    result = collection.bulk_write(ops)
    print(
        f"Done. Upserted: {result.upserted_count}, Modified: {result.modified_count}, "
        f"Matched: {result.matched_count} (total champions: {len(ops)})"
    )
    client.close()


if __name__ == "__main__":
    use_remote = "--remote" in sys.argv
    seed(use_remote)
