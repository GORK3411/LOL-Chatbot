using LOLChatbot.Api.Entities;
using LOLChatbot.Api.Repositories;
using System.Net.Http.Json;

namespace LOLChatbot.Api.Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository chatRepository;
        private readonly IHttpClientFactory httpClientFactory;

        private record AgentMessage(string Role, string Content);
        private record AgentRequest(List<AgentMessage> Messages);
        private record AgentResponse(string Reply);

        public ChatService(IChatRepository chatRepository, IHttpClientFactory httpClientFactory)
        {
            this.chatRepository = chatRepository;
            this.httpClientFactory = httpClientFactory;
        }

        public async Task<Chat?> GetChatByIdAsync(string id, string userId)
        {
            var chat = await chatRepository.GetChatByIdAsync(id);
            if (chat == null || chat.UserId != userId) return null;
            return chat;
        }

        public Task<Chat> CreateChatAsync(string chatName, string userId) =>
            chatRepository.CreateChatAsync(chatName, userId);

        public async Task<bool> DeleteChatAsync(string id, string userId)
        {
            var chat = await chatRepository.GetChatByIdAsync(id);
            if (chat == null || chat.UserId != userId) return false;
            return await chatRepository.DeleteChatAsync(id);
        }

        public Task<List<Chat>> GetChatsByUserIdAsync(string userId) =>
            chatRepository.GetChatsByUserIdAsync(userId);

        public async Task<bool> RenameChatAsync(string id, string userId, string newName)
        {
            var chat = await chatRepository.GetChatByIdAsync(id);
            if (chat == null || chat.UserId != userId) return false;
            return await chatRepository.RenameChat(id, newName);
        }

        public async Task<string?> SendMessageAsync(string chatId, string userId, string message)
        {
            var chat = await chatRepository.GetChatByIdAsync(chatId);
            if (chat == null || chat.UserId != userId) return null;

            chat.Messages.Add(new Message { Role = MessageRole.User, Content = message });

            var agentMessages = chat.Messages
                .Select(m => new AgentMessage(m.Role.ToString().ToLower(), m.Content))
                .ToList();

            var http = httpClientFactory.CreateClient("agent");
            var response = await http.PostAsJsonAsync("/chat", new AgentRequest(agentMessages));
            response.EnsureSuccessStatusCode();

            var agentResult = await response.Content.ReadFromJsonAsync<AgentResponse>();
            var reply = agentResult!.Reply;

            await chatRepository.AddMessageToChatAsync(chatId, MessageRole.User, message);
            await chatRepository.AddMessageToChatAsync(chatId, MessageRole.Assistant, reply);
            return reply;
        }
    }
}
