using LOLChatbot.Api.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LOLChatbot.Api.Repositories;

namespace LOLChatbot.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatRepository chatRepository;

        public ChatController(IChatRepository chatRepository)
        {
            this.chatRepository = chatRepository;
        }

        //Get chat by id
        [HttpGet("{id}")]
        public async Task<ActionResult<Chat>> GetChatById(string id)
        {
            var chat = await chatRepository.GetChatByIdAsync(id);
            return chat != null ? Ok(chat) : NotFound();
        }

        //Create a new chat
        [HttpPost]
        public async Task<ActionResult<Chat>> CreateChat(string chatName)
        {
            var chat = await chatRepository.CreateChatAsync(chatName);
            return CreatedAtAction(nameof(GetChatById), new { id = chat.Id }, chat);
        }

        //Delete a chat by id
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteChat(string id)
        {
            return await chatRepository.DeleteChatAsync(id) ? NoContent() : NotFound();
        }

        //Get all chats per UserId
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<Chat>>> GetChatsByUserId(string userId)
        {
            var userChats = await chatRepository.GetChatsByUserIdAsync(userId);
            return Ok(userChats);
        }

        //Send a message to a chat and get the agent's reply
        [HttpPost("{chatId}/messages")]
        public async Task<ActionResult<string>> SendMessage(string chatId, [FromQuery] string message)
        {
            var userAdded = await chatRepository.AddMessageToChatAsync(chatId, message);
            if (!userAdded) return NotFound();

            const string agentReply = "This is a placeholder answer from the agent.";
            await chatRepository.AddMessageToChatAsync(chatId, agentReply);

            return Ok(agentReply);
        }

        //Rename a chat
        [HttpPut("{id}/rename")]
        public async Task<ActionResult> RenameChat(string id, [FromQuery] string newName)
        {
            return await chatRepository.RenameChat(id, newName) ? NoContent() : NotFound();
        }
    }
}
