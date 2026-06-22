using LOLChatbot.Api.Entities;
using LOLChatbot.Api.Models;

namespace LOLChatbot.Api.Services
{
    public interface IAuthService
    {
        public Task<User?> RegisterAsync(UserDto userDto);
        public Task<string?> LoginAsync(UserDto userDto);  
    }
}
