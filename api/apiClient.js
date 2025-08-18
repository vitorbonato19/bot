const axios = require('axios');

const API_BASE_URL = 'https://prod-api.lzt.market';

async function fetchAccountsByPlatform(platform, token, filters = {}) {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/${platform}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: filters, // 🔑 envia os filtros como query params
    });

    const url = axios.getUri({
      url: `${API_BASE_URL}/${platform}`,
      ...config,
    });

    console.log(`URL de requisicao: ${url}`);

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
