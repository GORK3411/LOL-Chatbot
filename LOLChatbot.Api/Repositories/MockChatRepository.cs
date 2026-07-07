using LOLChatbot.Api.Entities;
using MongoDB.Bson;

namespace LOLChatbot.Api.Repositories
{
    public class MockChatRepository : IChatRepository
    {
        private static readonly List<Chat> chats = new()
        {
            // User-1 chats
            new Chat
            {
                Id = ObjectId.GenerateNewId().ToString(),
                ChatName = "General tips",
                UserId = "user-1",
                Messages = new List<Message>
                {
                    new() { Role = MessageRole.Assistant, Content = "Ask me about champions, builds, or lane matchups." },
                    new() { Role = MessageRole.User,      Content = "What's a good build for Ahri?" },
                    new() { Role = MessageRole.Assistant, Content = "She excels in the mid lane with mobility." },
                    new() { Role = MessageRole.Assistant, Content = "You can rush Luden's Echo for damage." },
                },
                LastUpdate = DateTime.UtcNow
            },
            new Chat
            {
                Id = ObjectId.GenerateNewId().ToString(),
                ChatName = "Ranked prep",
                UserId = "user-1",
                Messages = new List<Message>
                {
                    new() { Role = MessageRole.Assistant, Content = "Try to lock in a comfort pick and a simple game plan." },
                    new() { Role = MessageRole.User,      Content = "I'm thinking of playing Garen top." },
                    new() { Role = MessageRole.Assistant, Content = "Garen is solid for climbing. Focus on farming." },
                    new() { Role = MessageRole.User,      Content = "What about his matchups against Darius?" },
                    new() { Role = MessageRole.Assistant, Content = "Play it safe early and scale into teamfights." },
                    new() { Role = MessageRole.User,      Content = "Thanks for the tips!" },
                },
                LastUpdate = DateTime.UtcNow
            },
            new Chat
            {
                Id = ObjectId.GenerateNewId().ToString(),
                ChatName = "Support strategies",
                UserId = "user-1",
                Messages = new List<Message>
                {
                    new() { Role = MessageRole.User,      Content = "What's the best support for this meta?" },
                    new() { Role = MessageRole.Assistant, Content = "Thresh and Leona are always meta picks." },
                    new() { Role = MessageRole.User,      Content = "What about Janna?" },
                    new() { Role = MessageRole.Assistant, Content = "Janna is great for peel and utility." },
                    new() { Role = MessageRole.Assistant, Content = "Her shield provides good protection." },
                    new() { Role = MessageRole.User,      Content = "Should I focus on warding?" },
                    new() { Role = MessageRole.Assistant, Content = "Absolutely, vision control is crucial." },
                    new() { Role = MessageRole.User,      Content = "Thanks!" },
                    new() { Role = MessageRole.Assistant, Content = "Good luck in ranked!" },
                },
                LastUpdate = DateTime.UtcNow
            },
            // User-2 chats
            new Chat
            {
                Id = ObjectId.GenerateNewId().ToString(),
                ChatName = "ADC guides",
                UserId = "user-2",
                Messages = new List<Message>
                {
                    new() { Role = MessageRole.User,      Content = "I want to learn ADC. What champions should I play?" },
                    new() { Role = MessageRole.Assistant, Content = "Jinx and Ashe are beginner-friendly ADCs." },
                    new() { Role = MessageRole.User,      Content = "What about Caitlyn?" },
                    new() { Role = MessageRole.Assistant, Content = "Caitlyn has great range and poke damage." },
                    new() { Role = MessageRole.User,      Content = "How do I position in teamfights?" },
                    new() { Role = MessageRole.Assistant, Content = "Stay behind your team and focus the closest enemy." },
                    new() { Role = MessageRole.User,      Content = "What's the build path?" },
                },
                LastUpdate = DateTime.UtcNow
            },
            new Chat
            {
                Id = ObjectId.GenerateNewId().ToString(),
                ChatName = "Jungle pathing",
                UserId = "user-2",
                Messages = new List<Message>
                {
                    new() { Role = MessageRole.User,      Content = "How do I path efficiently as Lee Sin?" },
                    new() { Role = MessageRole.Assistant, Content = "Start Krugs, then Raptors, then Wolves." },
                    new() { Role = MessageRole.User,      Content = "Should I full clear or gank early?" },
                    new() { Role = MessageRole.Assistant, Content = "It depends on your team's lane pressure." },
                    new() { Role = MessageRole.User,      Content = "Where's the best place to ward?" },
                    new() { Role = MessageRole.Assistant, Content = "Ward river entrances and enemy buffs." },
                    new() { Role = MessageRole.User,      Content = "What's the optimal build?" },
                    new() { Role = MessageRole.Assistant, Content = "Trinity Force into Black Cleaver works well." },
                    new() { Role = MessageRole.User,      Content = "Thanks for the help!" },
                    new() { Role = MessageRole.Assistant, Content = "Good luck!" },
                },
                LastUpdate = DateTime.UtcNow
            }
        };

        private static readonly object syncRoot = new();

        public Task<Chat?> GetChatByIdAsync(string id)
        {
            lock (syncRoot)
            {
                return Task.FromResult(chats.FirstOrDefault(chat => chat.Id == id));
            }
        }

        public Task<Chat> CreateChatAsync(string chatName, string userId)
        {
            var chat = new Chat
            {
                Id = ObjectId.GenerateNewId().ToString(),
                ChatName = chatName,
                UserId = userId,
                Messages = new List<Message>(),
                LastUpdate = DateTime.UtcNow
            };

            lock (syncRoot)
            {
                chats.Add(chat);
            }

            return Task.FromResult(chat);
        }

        public Task<bool> DeleteChatAsync(string id)
        {
            lock (syncRoot)
            {
                var chat = chats.FirstOrDefault(item => item.Id == id);
                if (chat == null) return Task.FromResult(false);

                chats.Remove(chat);
                return Task.FromResult(true);
            }
        }

        public Task<List<Chat>> GetChatsByUserIdAsync(string userId)
        {
            lock (syncRoot)
            {
                return Task.FromResult(chats.Where(chat => chat.UserId == userId).ToList());
            }
        }

        public Task<bool> AddMessageToChatAsync(string chatId, MessageRole role, string content)
        {
            lock (syncRoot)
            {
                var chat = chats.FirstOrDefault(item => item.Id == chatId);
                if (chat == null) return Task.FromResult(false);

                chat.Messages.Add(new Message { Role = role, Content = content });
                chat.LastUpdate = DateTime.UtcNow;
                return Task.FromResult(true);
            }
        }

        public Task<bool> RenameChat(string id, string newName)
        {
            lock (syncRoot)
            {
                var chat = chats.FirstOrDefault(item => item.Id == id);
                if (chat == null) return Task.FromResult(false);

                chat.ChatName = newName;
                chat.LastUpdate = DateTime.UtcNow;
                return Task.FromResult(true);
            }
        }
    }
}
