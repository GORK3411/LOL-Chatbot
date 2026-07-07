from fastapi import FastAPI
from pydantic import BaseModel
from langchain.messages import HumanMessage, AIMessage
from agent import agent

app = FastAPI()


class MessageIn(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[MessageIn]


class ChatResponse(BaseModel):
    reply: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    lc_messages = [
        HumanMessage(m.content) if m.role == "user" else AIMessage(m.content)
        for m in request.messages
    ]
    result = agent.invoke({"messages": lc_messages})
    return ChatResponse(reply=result["messages"][-1].content)
