using LOLChatbot.Api.Entities;
using MongoDB.Driver;

namespace LOLChatbot.Api.Data
{
    public class MongoDbService
    {
        private readonly IConfiguration configuration;
        private readonly IMongoDatabase? database;
        public MongoDbService(IConfiguration configuration)
        {
            this.configuration = configuration;
            
            var connectionString = configuration.GetConnectionString("DbConnection");
            var mongoUrl = new MongoUrl(connectionString);
            var client = new MongoClient(mongoUrl);
            database = client.GetDatabase(mongoUrl.DatabaseName);
            CreateIndexes();
        }

        private void CreateIndexes()
        {
            var users = Database.GetCollection<User>("users");
            var indexKeys = Builders<User>.IndexKeys.Ascending(u => u.Email);
            var indexOptions = new CreateIndexOptions { Unique = true };
            users.Indexes.CreateOne(new CreateIndexModel<User>(indexKeys, indexOptions));
        }

        public IMongoDatabase? Database => database;
    }
}
