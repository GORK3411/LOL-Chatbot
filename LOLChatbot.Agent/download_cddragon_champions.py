import json
import urllib.error
import urllib.request
from pathlib import Path

CHAMPIONS_DIR = Path(__file__).parent / "json" / "champions"
OUTPUT_DIR = Path(__file__).parent / "json" / "cddragon"
BASE_URL = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/"


def get_champion_ids() -> list[int]:
    ids = []
    for path in CHAMPIONS_DIR.glob("*.json"):
        with open(path, encoding="utf-8") as f:
            ids.append(json.load(f)["id"])
    return ids


def fetch_champion(champion_id: int) -> dict:
    url = f"{BASE_URL}{champion_id}.json"
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request) as response:
        return json.loads(response.read())


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    champion_ids = get_champion_ids()
    print(f"Found {len(champion_ids)} champion ids in {CHAMPIONS_DIR}")

    for champion_id in champion_ids:
        try:
            data = fetch_champion(champion_id)
        except urllib.error.HTTPError as e:
            print(f"Failed to fetch champion {champion_id}: {e}")
            continue

        name = data["name"]
        out_path = OUTPUT_DIR / f"{name}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"Saved {name} ({champion_id}) -> {out_path}")


if __name__ == "__main__":
    main()
