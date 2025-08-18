const { fetchAccountsByPlatform } = require('./apiClient');

async function searchAccountsAndRespond(message, filters) {
  const plataforma = filters.plataforma;
  if (!plataforma) {
    await message.reply('❌ Plataforma não definida. Por favor, inicie o processo novamente.');
    return;
  }

  // Monta os filtros e remove os que são null ou undefined
  const apiFilters = {
    pmin: filters.pmin,
    pmax: filters.pmax,
    gmax: filters.gmax,
    gmin: filters.gmin,
    origin: filters.origin,
    currency: filters.currency,
    email_login_data: filters.email_login_data,
  };

  // Remove campos com valor null ou undefined
  Object.keys(apiFilters).forEach(key => {
    if (apiFilters[key] == null) delete apiFilters[key];
  });

  try {
    const items = await fetchAccountsByPlatform(plataforma, process.env.LZT_API_TOKEN, apiFilters);

    if (!items.length) {
      await message.reply('⚠️ Nenhuma conta encontrada com os filtros selecionados.');
      return;
    }

    const listaContas = items
      .slice(0, 10)
      .map(c => `🎮 ${c.title} — 💲R$${c.price}`)
      .join('\n');

    await message.reply(`✅ Aqui estão as melhores contas encontradas:\n\n${listaContas}`);
  } catch (error) {
    console.error('Erro na consulta da API:', error);
    await message.reply('❌ Erro ao buscar as contas. Tente novamente mais tarde.');
  }
}

module.exports = { searchAccountsAndRespond };
