const { fetchAccountsByPlatform } = require('./apiClient');

async function searchAccountsAndRespond(interaction, filters) {
  const plataforma = filters.plataforma;
  if (!plataforma) {
    await interaction.followUp('❌ Plataforma não definida. Por favor, inicie o processo novamente.');
    return;
  }

  const apiFilters = { ...filters };
  Object.keys(apiFilters).forEach(key => {
    if (apiFilters[key] === null || apiFilters[key] === undefined || apiFilters[key] === '') {
      delete apiFilters[key];
    }
  });

  try {
    const items = await fetchAccountsByPlatform(plataforma, process.env.LZT_API_TOKEN, apiFilters);

    if (!items.length) {
      await interaction.followUp('⚠️ Nenhuma conta encontrada com os filtros selecionados.');
      return;
    }

    const listaContas = items
      .slice(0, 10)
      .map(c => `🎮 ${c.title} — 💲R$${c.price}`)
      .join('\n');

    const resetButton = new ButtonBuilder()
      .setCustomId('reset_chat')
      .setLabel('Resetar Chat')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(resetButton);

    await interaction.followUp({
      content: `✅ Aqui estão as melhores contas encontradas:\n\n${listaContas}\n\nClique no botão abaixo para resetar o chat.`,
      components: [row],
    });
  } catch (error) {
    console.error('Erro na consulta da API:', error);
    await interaction.followUp('❌ Erro ao buscar as contas. Tente novamente mais tarde.');
  }
}

module.exports = { searchAccountsAndRespond };
