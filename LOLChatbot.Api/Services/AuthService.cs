using LOLChatbot.Api.Entities;
using LOLChatbot.Api.Models;
using LOLChatbot.Api.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace LOLChatbot.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository userRepository;
        private readonly IEmailService emailService;
        private readonly IConfiguration configuration;
        public AuthService(IUserRepository userRepository, IEmailService emailService, IConfiguration configuration)
        {
            this.userRepository = userRepository;
            this.emailService = emailService;
            this.configuration = configuration;
        }
        public async Task<string?> LoginAsync(UserDto userDto)
        {
            User? user = await userRepository.GetUserByEmail(userDto.Email);
            if (user == null)
                return null;

            if (!user.IsVerified)
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

            try
            {
                await userRepository.CreateUserAsync(user);
                await SendVerificationLink(user.Email);
                return user;
            }
            catch(Exception ex)
            {
                await userRepository.DeleteUser(user.Id);
                return null;
            }
        }

        public async Task SendVerificationLink(string email)
        {
            User? user = await userRepository.GetUserByEmail(email);
            if (user == null)
                return;

        
            var token = GenerateVerificationToken();
            user.VerificationToken = token;
            user.VerificationTokenExpires = DateTime.UtcNow.AddHours(24);
            await userRepository.UpdateUserAsync(user);

            var apiBaseUrl = configuration.GetValue<string>("AppSettings:ApiBaseUrl");
            var verificationLink = $"{apiBaseUrl}/api/auth/verify?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(token)}";

            var body = $"<p>Please verify your account by clicking the link below:</p>" +
                       $"<p><a href=\"{verificationLink}\">Verify my account</a></p>";

            await emailService.SendEmailAsync(user.Email, "Verify your account", body);
        }

        private static string GenerateVerificationToken()
        {
            var randomBytes = RandomNumberGenerator.GetBytes(32);
            return Convert.ToBase64String(randomBytes)
                .Replace("+", "-")
                .Replace("/", "_")
                .Replace("=", "");
        }

        public async Task<bool> VerifyEmail(string email, string token)
        {
            User user = await userRepository.GetUserByEmail(email);
            if(user == null)
                return false;

            if(user.IsVerified) return true;

            if(user.VerificationToken != token || user.VerificationTokenExpires < DateTime.UtcNow)
                return false;
            user.IsVerified = true;
            await userRepository.UpdateUserAsync(user);
            return true;
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
