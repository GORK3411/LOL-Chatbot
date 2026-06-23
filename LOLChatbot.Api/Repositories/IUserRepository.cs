using LOLChatbot.Api.Entities;

namespace LOLChatbot.Api.Repositories
{
    public interface IUserRepository
    {
        public Task<User?> CreateUserAsync(Entities.User user);
        public Task<User?> GetUserById(string id); 
        public Task<User?> GetUserByUsername(string username);
        public Task<User?> GetUserByEmail(string email);
    }
}
