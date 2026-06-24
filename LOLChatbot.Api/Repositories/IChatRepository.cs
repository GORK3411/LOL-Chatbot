using LOLChatbot.Api.Entities;

namespace LOLChatbot.Api.Repositories
{
    public interface IChatRepository
    {
        public Task<Chat?> GetChatByIdAsync(string id);
        public Task<Chat> CreateChatAsync(string chatName);
        public Task<bool> DeleteChatAsync(string id);
        public Task<List<Chat>> GetChatsByUserIdAsync(string userId);
        public Task<bool> AddMessageToChatAsync(string chatId, string message);
        public Task<bool> RenameChat(string id, string newName);

    }
}
