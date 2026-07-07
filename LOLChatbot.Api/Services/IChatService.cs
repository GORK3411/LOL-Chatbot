using LOLChatbot.Api.Entities;

namespace LOLChatbot.Api.Services
{
    public interface IChatService
    {
        Task<Chat?> GetChatByIdAsync(string id, string userId);
        Task<Chat> CreateChatAsync(string chatName, string userId);
        Task<bool> DeleteChatAsync(string id, string userId);
        Task<List<Chat>> GetChatsByUserIdAsync(string userId);
        Task<string?> SendMessageAsync(string chatId, string userId, string message);
        Task<bool> RenameChatAsync(string id, string userId, string newName);
    }
}
