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
                Messages = new List<string>
                {
                    "Ask me about champions, builds, or lane matchups.",
                    "What's a good build for Ahri?",
                    "She excels in the mid lane with mobility.",
                    "You can rush Luden's Echo for damage."
                },
                LastUpdate = DateTime.UtcNow
            },
            new Chat
            {
                Id = ObjectId.GenerateNewId().ToString(),
                ChatName = "Ranked prep",
                UserId = "user-1",
                Messages = new List<string>
                {
                    "Try to lock in a comfort pick and a simple game plan.",
                    "I'm thinking of playing Garen top.",
                    "Garen is solid for climbing. Focus on farming.",
                    "What about his matchups against Darius?",
                    "Play it safe early and scale into teamfights.",
                    "Thanks for the tips!"
                },
                LastUpdate = DateTime.UtcNow
            },
            new Chat
            {
                Id = ObjectId.GenerateNewId().ToString(),
                ChatName = "Support strategies",
                UserId = "user-1",
                Messages = new List<string>
                {
                    "What's the best support for this meta?",
                    "Thresh and Leona are always meta picks.",
                    "What about Janna?",
                    "Janna is great for peel and utility.",
                    "Her shield provides good protection.",
                    "Should I focus on warding?",
                    "Absolutely, vision control is crucial.",
                    "Thanks!",
                    "Good luck in ranked!"
                },
                LastUpdate = DateTime.UtcNow
            },
            // User-2 chats
            new Chat
            {
                Id = ObjectId.GenerateNewId().ToString(),
                ChatName = "ADC guides",
                UserId = "user-2",
                Messages = new List<string>
                {
                    "I want to learn ADC. What champions should I play?",
                    "Jinx and Ashe are beginner-friendly ADCs.",
                    "What about Caitlyn?",
                    "Caitlyn has great range and poke damage.",
                    "How do I position in teamfights?",
                    "Stay behind your team and focus the closest enemy.",
                    "What's the build path?"
                },
                LastUpdate = DateTime.UtcNow
            },
            new Chat
            {
                Id = ObjectId.GenerateNewId().ToString(),
                ChatName = "Jungle pathing",
                UserId = "user-2",
                Messages = new List<string>
                {
                    "How do I path efficiently as Lee Sin?",
                    "Start Krugs, then Raptors, then Wolves.",
                    "Should I full clear or gank early?",
                    "It depends on your team's lane pressure.",
                    "Where's the best place to ward?",
                    "Ward river entrances and enemy buffs.",
                    "What's the optimal build?",
                    "Trinity Force into Black Cleaver works well.",
                    "Thanks for the help!",
                    "Good luck!"
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

        public Task<Chat> CreateChatAsync(string chatName)
        {
            var chat = new Chat
            {
                Id = ObjectId.GenerateNewId().ToString(),
                ChatName = chatName,
                UserId = "user-1",
                Messages = new List<string>(),
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
                if (chat == null)
                {
                    return Task.FromResult(false);
                }

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

        public Task<bool> AddMessageToChatAsync(string chatId, string message)
        {
            lock (syncRoot)
            {
                var chat = chats.FirstOrDefault(item => item.Id == chatId);
                if (chat == null)
                {
                    return Task.FromResult(false);
                }

                chat.Messages.Add(message);
                chat.LastUpdate = DateTime.UtcNow;
                return Task.FromResult(true);
            }
        }

        public Task<bool> RenameChat(string id, string newName)
        {
            lock (syncRoot)
            {
                var chat = chats.FirstOrDefault(item => item.Id == id);
                if (chat == null)
                {
                    return Task.FromResult(false);
                }

                chat.ChatName = newName;
                chat.LastUpdate = DateTime.UtcNow;
                return Task.FromResult(true);
            }
        }
    }
}