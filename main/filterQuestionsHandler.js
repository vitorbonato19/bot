const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { questions } = require('./questions');
const { searchAccountsAndRespond } = require('../api/searchHandler');

const userStep = new Map(); // usuário => índice pergunta atual
const userFilters = new Map(); // usuário => objeto filtros

// envia a próxima pergunta como select menu
async function askNextQuestion(interaction, userId) {
  let step = userStep.get(userId) ?? 0;
  const currentQuestion = questions[step];

  if (!currentQuestion) {
    // acabou as perguntas -> chama a busca
    const filters = userFilters.get(userId);
    await interaction.followUp('✅ Obrigado! Buscando as melhores contas para você...');
    await searchAccountsAndRespond(interaction, filters);
    userStep.delete(userId);
    userFilters.delete(userId);
    return;
  }

  // cria o select menu
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(`question_${currentQuestion.key}`)
    .setPlaceholder(currentQuestion.question)
    .addOptions(currentQuestion.options);

  const row = new ActionRowBuilder().addComponents(selectMenu);

  await interaction.followUp({
    content: currentQuestion.question,
    components: [row],
  });
}

// trata quando o usuário seleciona uma resposta
async function handleFilterAnswer(interaction) {
  if (!interaction.isStringSelectMenu()) return;
  if (!interaction.customId.startsWith('question_')) return;

  const userId = interaction.user.id;
  let step = userStep.get(userId) ?? 0;
  const filterData = userFilters.get(userId) || {};

  const currentQuestion = questions[step];
  if (!currentQuestion) return;

  // pega a resposta selecionada
  const answer = interaction.values[0];

  if (answer !== '') {
    // ✅ guarda o filtro se não for vazio
    filterData[currentQuestion.key] = answer;
  } else {
    // 🚫 remove o filtro se for "sem valor"
    delete filterData[currentQuestion.key];
  }

  userFilters.set(userId, filterData);

  // avança pergunta
  step++;
  userStep.set(userId, step);

  // remove o menu da pergunta anterior (para não deixar clicável depois)
  await interaction.update({
    content: `✅ Você escolheu: **${answer || 'Nenhum valor definido'}**`,
    components: [],
  });

  // chama próxima pergunta
  await askNextQuestion(interaction, userId);
}

module.exports = {
  handleFilterAnswer,
  userStep,
  userFilters,
  askNextQuestion,
};
