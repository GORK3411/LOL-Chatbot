from langchain.messages import HumanMessage, AIMessage
from agent import agent

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
