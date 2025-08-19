const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');
require('dotenv').config({ debug: false });

const { handleMessage, handleInteraction } = require('./main/handlers');

const { setDiscordClient } = require('./api/webhook/routes/routes');

// Depois de criar o client



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
  console.log(`✅ Bot online como ${client.user.username}`);
});

client.on('messageCreate', async (message) => {
  await handleMessage(client, message);
});

client.on('interactionCreate', async (interaction) => {
  await handleInteraction(interaction);
});

console.log('🔗 Conectando ao Discord...');
client.login(process.env.DISCORD_TOKEN);
console.log('✅ Discord conectado!');
console.log('🔗 Configurando webhook...');
setDiscordClient(client);
