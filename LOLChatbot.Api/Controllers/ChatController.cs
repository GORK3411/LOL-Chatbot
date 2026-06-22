using LOLChatbot.Api.Data;
using LOLChatbot.Api.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace LOLChatbot.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IMongoCollection<Chat> chats;
        public ChatController(MongoDbService mongoDbService)
        {
            chats = mongoDbService.Database.GetCollection<Chat>("chats");
        }

        //Get chat by id
        [HttpGet("{id}")]
        public ActionResult<Chat> GetChatById(string id)
        {
            var filter = Builders<Chat>.Filter.Eq(c => c.Id, id);
            var chat = chats.Find(filter).FirstOrDefault();
            return chat != null ? Ok(chat) : NotFound();
        }

        //Create a new chat
        [HttpPost]
        public async Task<ActionResult<Chat>> CreateChat([FromBody] Chat chat)
        {
            await chats.InsertOneAsync(chat);
            return CreatedAtAction(nameof(GetChatById), new { id = chat.Id }, chat);
        }

        //Delete a chat by id
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteChat(string id)
        {
            var filter = Builders<Chat>.Filter.Eq(c => c.Id, id);
            var result = await chats.DeleteOneAsync(filter);
            return result.DeletedCount > 0 ? NoContent() : NotFound();
        }
    }
}
