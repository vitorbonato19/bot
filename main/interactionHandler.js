const { userFilters, userStep, askNextQuestion, handleFilterAnswer, handleReset } = require('./filterQuestionsHandler');

async function handleInteraction(interaction) {
  if (!interaction.isStringSelectMenu() && !interaction.isButton()) return;

  // caso: escolha de plataforma
  if (interaction.customId === 'plataformas') {
    const userId = interaction.user.id;
    const plataforma = interaction.values[0];

    const filtros = userFilters.get(userId) || {};
    filtros.plataforma = plataforma;
    userFilters.set(userId, filtros);

    // resetar passo para começar perguntas
    userStep.set(userId, 0);

    await interaction.update({
      content: `✅ Plataforma **${plataforma}** escolhida! Agora vou te fazer algumas perguntas para filtrar melhor as contas.`,
      components: [],
    });

    // dispara primeira pergunta
    await askNextQuestion(interaction, userId);
    return;
  }

  // caso: resposta de filtro
  if (interaction.customId.startsWith('question_')) {
    await handleFilterAnswer(interaction);
    return;
  }

  // caso: botão de reset
  if (interaction.customId === 'reset_chat') {
    await handleReset(interaction);
    return;
  }
}

module.exports = { handleInteraction };
