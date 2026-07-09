using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LOLChatbot.Api.Entities;
using LOLChatbot.Api.Models;
using Microsoft.AspNetCore.Identity;
using LOLChatbot.Api.Services;
using Microsoft.AspNetCore.Authorization;
using LOLChatbot.Api.Repositories;
namespace LOLChatbot.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;
        private readonly IConfiguration configuration;
        public AuthController(IAuthService authService, IConfiguration configuration)
        {
            this.authService = authService;
            this.configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto userDto)
        {

            User? user;
            try
            {
                user = await authService.RegisterAsync(userDto);
            }
            catch
            {
                return BadRequest();
            }

            if (user == null)
                return BadRequest();
            return Ok(user);
        }
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserDto userDto)
        {
            string? token = await authService.LoginAsync(userDto);
            if (token == null)
                return BadRequest();
            return token;

        }

        [Authorize]
        [HttpGet("test")]
        public ActionResult<string> AuthorizeTest()
        {
            return Ok("AAAAA");
        }
        [HttpGet("verify")]
        public async Task<IActionResult> VerifyAccount(string email, string token)
        {
            var verified = await authService.VerifyEmail(email, token);
            var frontEndUrl = configuration.GetValue<string>("FrontEndUrl");

            if (verified)
                return Redirect($"{frontEndUrl}/verify-success");

            return Redirect($"{frontEndUrl}/verify-failure?email={Uri.EscapeDataString(email)}");
        }
        [HttpPost("send_link")]
        public async Task<ActionResult> SendVerificationLink(string email)
        {
            await authService.SendVerificationLink(email);
            return Ok();
        }
    }
}
