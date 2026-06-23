using LOLChatbot.Api.Data;
using LOLChatbot.Api.Entities;
using MongoDB.Driver;

namespace LOLChatbot.Api.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> users;

        public UserRepository(MongoDbService mongoDbService)
        {
            users = mongoDbService.Database.GetCollection<User>("users");
        }

        public async Task<User?> CreateUserAsync(User user)
        {
            await users.InsertOneAsync(user);
            return user;
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await users.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserById(string id)
        {
            return await users.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByUsername(string username)
        {
            return await users.Find(u => u.Username == username).FirstOrDefaultAsync();
        }
    }
}
