using LOLChatbot.Api.Entities;
using LOLChatbot.Api.Models;
using LOLChatbot.Api.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace LOLChatbot.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository userRepository;
        private readonly IConfiguration configuration;
        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            this.userRepository = userRepository;
            this.configuration = configuration;
        }
        public async Task<string?> LoginAsync(UserDto userDto)
        {
            User? user = await userRepository.GetUserByEmail(userDto.Email);
            if(user == null)
                return null;
            
            var passwordVerificationResult = new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, userDto.Password);
            
            if (passwordVerificationResult == PasswordVerificationResult.Success)
            {
                return GenerateJwtToken(user);
            }
            else
            {
                return null;
            }
        }

        public async Task<User?> RegisterAsync(UserDto userDto)
        { 
            var hashedPassword = new PasswordHasher<User>().HashPassword(null, userDto.Password);

            User user = new()
            { 
                Username = userDto.Username,
                Email = userDto.Email,
                PasswordHash = hashedPassword
            };

            return await userRepository.CreateUserAsync(user);
        }

        private string GenerateJwtToken(User user)
        {
            //Claims = info about the user that we want to include in the token
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.Username)
            };

            //Key = used to sign the token
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")));

            //SigningCredentials = used to specify the algorithm and key to sign the token
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            //TokenDescriptor = used to specify the claims, expiration, signing credentials and other properties of the token
            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration.GetValue<string>("AppSettings:Issuer"),
                audience: configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
                );  

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
    }
}
