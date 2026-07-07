from dotenv import load_dotenv
load_dotenv()

from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
from tools import (
    get_champion_info,
    get_champion_stat,
    scan_stats,
    scan_attribute_ratings,
    get_champion_ability,
    scan_abilities,
    search_abilities,
    get_champion_skins,
)

model = init_chat_model(model="ollama:qwen3:14b", temperature=0, reasoning=False)

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
        scan_abilities,
        search_abilities,
        get_champion_skins,
    ],
    system_prompt=system_prompt,
)
