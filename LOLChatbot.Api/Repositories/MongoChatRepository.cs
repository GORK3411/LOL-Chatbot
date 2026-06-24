using LOLChatbot.Api.Data;
using LOLChatbot.Api.Entities;
using MongoDB.Driver;

namespace LOLChatbot.Api.Repositories
{
    public class MongoChatRepository : IChatRepository
    {
        private readonly IMongoCollection<Chat> chats;

        public MongoChatRepository(MongoDbService mongoDbService)
        {
            chats = mongoDbService.Database.GetCollection<Chat>("chats");
        }

        public async Task<Chat?> GetChatByIdAsync(string id)
        {
            return await chats.Find(chat => chat.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Chat> CreateChatAsync(string chatName)
        {
            var chat = new Chat
            {
                ChatName = chatName,
                UserId = "user-1",
                LastUpdate = DateTime.UtcNow
            };

            await chats.InsertOneAsync(chat);
            return chat;
        }

        public async Task<bool> DeleteChatAsync(string id)
        {
            var result = await chats.DeleteOneAsync(chat => chat.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<List<Chat>> GetChatsByUserIdAsync(string userId)
        {
            return await chats.Find(chat => chat.UserId == userId).ToListAsync();
        }

        public async Task<bool> AddMessageToChatAsync(string chatId, string message)
        {
            var update = Builders<Chat>.Update
                .Push(chat => chat.Messages, message)
                .Set(chat => chat.LastUpdate, DateTime.UtcNow);
            var result = await chats.UpdateOneAsync(chat => chat.Id == chatId, update);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> RenameChat(string id, string newName)
        {
            var update = Builders<Chat>.Update
                .Set(chat => chat.ChatName, newName)
                .Set(chat => chat.LastUpdate, DateTime.UtcNow);
            var result = await chats.UpdateOneAsync(chat => chat.Id == id, update);
            return result.ModifiedCount > 0;
        }
    }
}