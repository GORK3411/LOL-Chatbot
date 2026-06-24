using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LOLChatbot.Api.Entities
{
    public class Chat
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string ChatName { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty;

        public List<string> Messages { get; set; } = new();
        public DateTime LastUpdate { get; set; }
    }
}
