const axios = require('axios');

const API_BASE_URL = 'https://prod-api.lzt.market';

async function fetchAccountsByPlatform(platform, token, filters = {}) {
  try {
    // Monta os parâmetros da URL a partir dos filtros
    const params = { ...filters };
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || params[key] === '' || params[key] === 'none') {
        delete params[key];
      }
    });

    // Constrói a URL completa com os parâmetros
    const url = `${API_BASE_URL}/${platform}`;
    const fullUrl = axios.getUri({
      url: url,
      params: params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`URL de requisição: ${fullUrl}`);

    // Faz a requisição
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params,
    });

    return data.items || [];
  } catch (error) {
    console.error(
      `Erro ao buscar contas para plataforma ${platform}:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

module.exports = {
  fetchAccountsByPlatform,
};
