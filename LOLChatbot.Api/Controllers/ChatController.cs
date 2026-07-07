using LOLChatbot.Api.Entities;
using LOLChatbot.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LOLChatbot.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService chatService;

        public ChatController(IChatService chatService)
        {
            this.chatService = chatService;
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("{id}")]
        public async Task<ActionResult<Chat>> GetChatById(string id)
        {
            var chat = await chatService.GetChatByIdAsync(id, GetCurrentUserId());
            return chat != null ? Ok(chat) : NotFound();
        }

        [HttpPost]
        public async Task<ActionResult<Chat>> CreateChat(string chatName)
        {
            var chat = await chatService.CreateChatAsync(chatName, GetCurrentUserId());
            return CreatedAtAction(nameof(GetChatById), new { id = chat.Id }, chat);
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteChat(string id) =>
            await chatService.DeleteChatAsync(id, GetCurrentUserId()) ? NoContent() : NotFound();

        [HttpGet("user")]
        public async Task<ActionResult<List<Chat>>> GetMyChats() =>
            Ok(await chatService.GetChatsByUserIdAsync(GetCurrentUserId()));

        [HttpPost("{chatId}/messages")]
        public async Task<ActionResult<string>> SendMessage(string chatId, [FromQuery] string message)
        {
            var reply = await chatService.SendMessageAsync(chatId, GetCurrentUserId(), message);
            return reply != null ? Ok(reply) : NotFound();
        }

        [HttpPut("{id}/rename")]
        public async Task<ActionResult> RenameChat(string id, [FromQuery] string newName) =>
            await chatService.RenameChatAsync(id, GetCurrentUserId(), newName) ? NoContent() : NotFound();
    }
}
