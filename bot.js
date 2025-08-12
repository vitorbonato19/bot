const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');
require('dotenv').config();

const { handleMessage, handleInteraction } = require('./handlers');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

client.once('ready', () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  await handleMessage(client, message);
});

client.on('interactionCreate', async (interaction) => {
  await handleInteraction(interaction);
});

client.login(process.env.DISCORD_TOKEN);
