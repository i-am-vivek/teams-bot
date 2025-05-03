const { ActivityHandler, MessageFactory } = require("botbuilder");
const axios = require("axios");
require("dotenv").config();

// Configure DigitalOcean API connection
const doClient = axios.create({
  baseURL: process.env.DO_AI_ENDPOINT,
  headers: {
    Authorization: `Bearer ${process.env.DO_API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

class DoAiBot extends ActivityHandler {
  constructor(conversationState) {
    super();

    this.conversationState = conversationState;

    // Handler for incoming messages
    this.onMessage(async (context, next) => {
      // console.log(context);
      const userInput = context.activity.text;
      // console.log(`User input: ${userInput}`);
      // Handle help command
      if (userInput.toLowerCase() === "help") {
        await context.sendActivity(
          "Type any question or prompt, and I will use DigitalOcean's AI to generate a response!",
        );
      } else {
        try {
          // Show typing indicator
          await context.sendActivity({ type: "typing" });

          // Call DigitalOcean AI service
          const aiResponse = await this.generateAIResponse(
            userInput,
            context.activity,
          );

          // Send response back to Teams
          await context.sendActivity(aiResponse);
        } catch (error) {
          await context.sendActivity(
            "Sorry, I encountered an error processing your request.",
          );
          // console.error(error);
        }
      }

      await next();
    });

    // Handler for members added to conversation
    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;

      for (const member of membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          await context.sendActivity(
            'Hello! I am a bot that can generate responses using DigitalOcean\'s AI. Type something to get started, or type "help" for more information.',
          );
        }
      }

      await next();
    });
  }

  // Function to call DigitalOcean's AI service
  async generateAIResponse(prompt, activity) {
    try {
      // console.log(activity);
      const response = await doClient.post("/api/v1/chat/completions", {
        messages: [
          {
            id: activity.from.id,
            role: activity.from.role,
            content: activity.text,
            sentTime: activity.from.localTimestamp,
            receivedTime: "",
          },
        ],
        stream: false,
        include_functions_info: false,
        include_retrieval_info: false,
        include_guardrails_info: false,
        provide_citations: false,
        stream_options: { include_usage: false },
      });
      // console.log(response.data.choices[0].message.content);
      // Extract and return the AI-generated text
      if (response.data) {
        return response.data.choices[0].message.content.trim();
      } else {
        return "I couldn't generate a response. Please try again.";
      }
    } catch (error) {
      console.error("Error calling DigitalOcean AI:", error.message);
      throw error;
    }
  }

  // Save state changes
  async run(context) {
    await super.run(context);
    await this.conversationState.saveChanges(context);
  }
}

module.exports.DoAiBot = DoAiBot;
