const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { questions } = require('./questions');
const { searchAccountsAndRespond } = require('../api/searchHandler');
const { handleGreeting } = require('./greetingHandler'); // Importa handleGreeting

const userStep = new Map();
const userFilters = new Map();

// envia a próxima pergunta como select menu
async function askNextQuestion(interaction, userId) {
  console.log(`askNextQuestion chamado para userId: ${userId}, step: ${userStep.get(userId) ?? 0}`);
  let step = userStep.get(userId) ?? 0;
  const currentQuestion = questions[step];

  if (!currentQuestion) {
    console.log(`Fim das perguntas para userId: ${userId}, iniciando busca`);
    const filters = userFilters.get(userId);
    await interaction.followUp('✅ Obrigado! Buscando as melhores contas para você...');
    await searchAccountsAndRespond(interaction, filters);

    // Adiciona botão de reset após a busca
    const resetButton = new ButtonBuilder()
      .setCustomId('reset_chat')
      .setLabel('Resetar Chat')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(resetButton);

    await interaction.followUp({
      content: 'Clique no botão abaixo para resetar o chat e começar de novo.',
      components: [row],
    });

    userStep.delete(userId);
    userFilters.delete(userId);
    console.log(`Botão de reset enviado para userId: ${userId}`);
    return;
  }

  // Cria o select menu, filtrando opções com value vazio
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(`question_${currentQuestion.key}`)
    .setPlaceholder(currentQuestion.question)
    .addOptions(currentQuestion.options.filter(option => option.value !== ''));

  const row = new ActionRowBuilder().addComponents(selectMenu);

  await interaction.followUp({
    content: currentQuestion.question,
    components: [row],
  });
  console.log(`Pergunta enviada para userId: ${userId}, step: ${step}`);
}

// trata quando o usuário seleciona uma resposta
async function handleFilterAnswer(interaction) {
  console.log(`handleFilterAnswer chamado para userId: ${interaction.user.id}`);
  if (!interaction.isStringSelectMenu()) return;
  if (!interaction.customId.startsWith('question_')) return;

  const userId = interaction.user.id;
  let step = userStep.get(userId) ?? 0;
  const filterData = userFilters.get(userId) || {};

  const currentQuestion = questions[step];
  if (!currentQuestion) return;

  const answer = interaction.values[0];

  if (answer !== '') {
    filterData[currentQuestion.key] = answer;
  } else {
    delete filterData[currentQuestion.key];
  }

  userFilters.set(userId, filterData);

  step++;
  userStep.set(userId, step);

  await interaction.update({
    content: `✅ Você escolheu: **${answer || 'Nenhum valor definido'}**`,
    components: [],
  });

  await askNextQuestion(interaction, userId);
  console.log(`Próxima pergunta ou fim para userId: ${userId}, novo step: ${step}`);
}

// trata o botão de reset
async function handleReset(interaction) {
  console.log(`handleReset chamado para userId: ${interaction.user.id}`);
  if (!interaction.isButton() || interaction.customId !== 'reset_chat') return;

  const userId = interaction.user.id;
  userStep.delete(userId);
  userFilters.delete(userId);

  await interaction.update({
    content: '✅ Chat resetado! Vamos começar de novo.',
    components: [],
  });
  await handleGreeting(interaction);
  console.log(`Chat resetado para userId: ${userId}`);
}

module.exports = {
  handleFilterAnswer,
  userStep,
  userFilters,
  askNextQuestion,
  handleReset,
};
