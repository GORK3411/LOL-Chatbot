using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LOLChatbot.Api.Entities;
using LOLChatbot.Api.Models;
using Microsoft.AspNetCore.Identity;
using LOLChatbot.Api.Services;
using Microsoft.AspNetCore.Authorization;

namespace LOLChatbot.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;
        public AuthController(IAuthService authService)
        {
            this.authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto userDto)
        {
            
            User? user;
            try
            {
                user =  await authService.RegisterAsync(userDto);
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
            if(token==null) 
                return BadRequest();
            return token;

        }

        [Authorize]
        [HttpGet("test")]
        public ActionResult<string> AuthorizeTest()
        {
            return Ok("AAAAA");
        }
    }
}
