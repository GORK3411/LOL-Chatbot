import requests
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.tools import tool, ToolRuntime
from langgraph.checkpoint.memory import InMemorySaver

load_dotenv()


@tool(
    "get_champion",
    description=(
        "Fetches detailed data about a League of Legends champion, including "
        "abilities, stats (attack range, health, damage, etc.), lore, and tags. "
        "Use this whenever the user asks anything specific about a champion. "
        "The `champion` argument must be the champion's name with the first "
        "letter capitalized, e.g. 'Warwick', 'Ahri', 'MissFortune'."
    ),
)
def get_champion(champion: str):
    with open(f"json/champions/{champion}.json", "r") as f:
        content = f.read()

    print("called tool for " + champion)
    return content


from langchain.chat_models import init_chat_model
from langchain.messages import HumanMessage, AIMessage, SystemMessage

# model = init_chat_model(model="google_genai:gemini-2.5-flash", temperature=0)
model = init_chat_model(model="ollama:llama3.1:8b", temperature=0)
checkpointer = InMemorySaver()

agent = create_agent(
    model=model,
    tools=[get_champion],
    system_prompt="You are a  chatbot that answers questions about league of legends champions",
    # checkpointer=checkpointer,
)

conversation = [
    HumanMessage("What is warwick attackrange? is it 125?"),
]


result = agent.invoke({"messages": conversation})
print(result["messages"][-1].content)


conversation.append(AIMessage(result["messages"][-1].content))
question = input("Any other question?")
conversation.append(HumanMessage(question))

result2 = agent.invoke({"messages": conversation})
print(result2["messages"][-1].content)
