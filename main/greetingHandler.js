const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { userFilters, userStep, askNextQuestion } = require('./filterQuestionsHandler');

const plataformasOptions = [
  { label: 'Steam 🔥', value: 'steam', description: 'Jogos da Steam' },
  { label: 'Riot Games 🧠', value: 'riot', description: 'League, Valorant, etc.' },
  { label: 'Epic Games 💥', value: 'epic', description: 'Fortnite e outros' },
];

const MENU_IDS = {
  PLATAFORMAS: 'plataformas',
};

async function handleGreeting(message) {
  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(MENU_IDS.PLATAFORMAS)
      .setPlaceholder('🎮 Escolha uma plataforma de jogos')
      .addOptions(plataformasOptions),
  );

  await message.reply({
    content: `👋 Olá **${message.author.username}**! Tudo certo por aí?\n\n💬 Me diga, em qual plataforma deseja ver ofertas de jogos hoje? Escolha abaixo 👇`,
    components: [row],
  });
}

// 👉 Novo: trata seleção de plataforma
async function handlePlatformSelection(interaction) {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== MENU_IDS.PLATAFORMAS) return;

  const userId = interaction.user.id;
  const plataforma = interaction.values[0];

  // salva escolha inicial
  const filtros = userFilters.get(userId) || {};
  filtros.plataforma = plataforma;
  userFilters.set(userId, filtros);

  // reseta passo das perguntas
  userStep.set(userId, 0);

  // confirma escolha e inicia questionário
  await interaction.update({
    content: `✅ Plataforma **${plataforma}** escolhida! Agora vou te fazer algumas perguntas para conseguir as melhores contas.`,
    components: [],
  });

  await askNextQuestion(interaction, userId);
}

module.exports = { handleGreeting, handlePlatformSelection, MENU_IDS };
