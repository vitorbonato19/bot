const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

// Lista reutilizável de opções
const plataformasOptions = [
  { label: 'Steam 🔥', value: 'steam', description: 'Jogos da Steam' },
  { label: 'Riot Games 🧠', value: 'riot', description: 'League, Valorant, etc.' },
  { label: 'Epic Games 💥', value: 'epic', description: 'Fortnite e outros' },
];

// Controle interno para últimas mensagens e locks por usuário
const lastMessageByUser = new Map();
const userLock = new Map();

async function handleMessage(client, message) {
  if (message.author.bot) return;

  console.log(`📩 Mensagem de ${message.author.username} (${message.author.id}) no canal ${message.channel.type}: "${message.content}"`);

  if (message.channel.type === 1) {
    console.log('📥 Mensagem recebida via DM!');
  }

  const content = message.content.toLowerCase().trim();
  const userId = message.author.id;

  if (content === 'oi') {
    if (userLock.get(userId)) {
      console.log(`Usuário ${userId} está na trava. Ignorando mensagem repetida.`);
      return;
    }

    const lastMessage = lastMessageByUser.get(userId);
    userLock.set(userId, true);

    if (lastMessage === content) {
      console.log(`Mensagem repetida "oi" do usuário ${userId}, aguardando 15 segundos antes de responder...`);
      await sleep(15000);
    }

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('plataformas')
          .setPlaceholder('🎮 Escolha uma plataforma de jogos')
          .addOptions(plataformasOptions),
      );

    await message.reply({
      content: `👋 Olá **${message.author.username}**! Tudo certo por aí?\n\n💬 Me diga, em qual plataforma deseja ver ofertas de jogos hoje? Escolha abaixo 👇`,
      components: [row],
    });

    lastMessageByUser.set(userId, content);
    userLock.set(userId, false);
  }
}

async function handleInteraction(interaction) {
  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId === 'plataformas') {
    const selectedValue = interaction.values[0];
    const selectedOption = plataformasOptions.find(opt => opt.value === selectedValue);

    await interaction.reply({
      content: `✅ Você escolheu: **${selectedOption.label}** ótima escolha!
      Só um momento que já estou consultando as contas disponíveis aqui ... 🕹️`,
      ephemeral: true
    });
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  handleMessage,
  handleInteraction
};
