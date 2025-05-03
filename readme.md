# Teams Bot with DigitalOcean AI Integration

This Microsoft Teams bot integrates with DigitalOcean's generative AI to provide intelligent responses to user queries.

## Setup Instructions

1. Clone this repository
2. Create a `.env` file with your credentials (see `.env.example`)
3. Install dependencies:
   ```
   npm install
   ```
4. Start the bot:
   ```
   npm start
   ```

## Deployment

1. Deploy the bot to a hosting service
2. Update the messaging endpoint in Azure Bot Service
3. Create a Teams app package using the manifest.json
4. Upload and install the app in Teams

## Usage

Simply type messages to the bot in Teams, and it will respond using DigitalOcean's AI.

## Configuration

Adjust the AI parameters in the `generateAIResponse` function in `bot.js` to change the behavior of the AI responses.
# teams-bot
