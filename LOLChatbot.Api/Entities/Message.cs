using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LOLChatbot.Api.Entities
{
    public class Message
    {
        [BsonRepresentation(BsonType.String)]
        public MessageRole Role { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
