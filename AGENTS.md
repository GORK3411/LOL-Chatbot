# AGENTS.md

## Project Shape

- This is a three-service League of Legends chatbot app:
  - [LOLChatbot.UI](LOLChatbot.UI/lol_chatbot) is the React frontend.
  - [LOLChatbot.Api](LOLChatbot.Api) is the ASP.NET backend for auth, chat CRUD, and proxying chat requests.
  - [LOLChatbot.Agent](LOLChatbot.Agent) is the Python FastAPI chatbot service.
- Treat the frontend as the only client of the API; the API is the only client of the Agent.
- Keep JWT auth, MongoDB chat storage, and champion-data lookups aligned across services.

## Working Rules

- This is a solo learning project, so prefer clear explanations alongside code changes when they help understanding.
- Do not assume a fixed LLM provider or model in the Agent; check the current code and config before changing model-specific behavior.
- Verify the target service before editing: React UI, C# API, or Python Agent each have different toolchains and entrypoints.
- Use PowerShell-compatible commands on Windows.
- Avoid duplicating material from the README; link to it instead when background context is enough.

## Service Notes

- UI work should respect the three main pages: signup, login, and chat.
- API work should stay focused on JWT auth, MongoDB-backed user/chat operations, and forwarding chat messages to the Agent.
- Agent work should stay focused on FastAPI, LangChain, and champion-related answers backed by Riot Data Dragon content.
- Champion JSON data lives under [LOLChatbot.Agent/json](LOLChatbot.Agent/json); keep data refresh changes consistent with [updateData.ps1](updateData.ps1).

## Useful Commands

- UI: `cd LOLChatbot.UI/lol_chatbot; npm install; npm start`
- API: `dotnet restore; dotnet build LOLChatbot.Api/LOLChatbot.Api.csproj; dotnet run`
- Agent: `cd LOLChatbot.Agent; python main.py`

## Reference Docs

- [README.md](README.md) for the top-level project overview.
- [LOLChatbot.UI/lol_chatbot/README.md](LOLChatbot.UI/lol_chatbot/README.md) for the React app scaffold notes.
