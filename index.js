// Import required packages
const dotenv = require("dotenv");
const path = require("path");
const restify = require("restify");
const {
  BotFrameworkAdapter,
  ConversationState,
  MemoryStorage,
} = require("botbuilder");
const { DoAiBot } = require("./bot");

// Import configuration settings
dotenv.config();

// Create HTTP server
const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.listen(process.env.PORT || 3978, () => {
  console.log(`\n${server.name} listening to ${server.url}`);
  console.log(
    `\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`,
  );
});

// Create adapter
const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
});

// Add error handling
adapter.onTurnError = async (context, error) => {
  console.error(`\n [onTurnError] error: ${error}`);
  await context.sendActivity("An error occurred. Please try again later.");
};

// Create memory storage and conversation state
const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);

// Create the bot instance
const bot = new DoAiBot(conversationState);

// Listen for incoming messages
server.post("/api/messages", (req, res, next) => {
  // console.log("Incoming message received");
  // console.log("Request body:", req.body);
  adapter.processActivity(req, res, async (context) => {
    await bot.run(context);
  });
});
