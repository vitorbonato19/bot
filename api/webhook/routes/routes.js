// routes.js
const express = require('express');
const { handleGreeting } = require('../../../main/greetingHandler');
const { userStep, userFilters } = require('../../../main/filterQuestionsHandler');
const { setUser } = require('./class');

const app = express();
app.use(express.json());

let client; // será setado pelo bot.js

// Rota GET que inicia o chatbot
app.get('/webhook/chat/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (!client) {
    return res.status(500).json({
      statusCode: 500,
      message: `Erro ao iniciar chat via webhook: problema ao configurar client Discord.`
    });
  }

  try {
    // Cria um objeto "mock" de message
    const mockMessage = {
      author: { id: userId, bot: false },
      reply: async (text) => {
        try {
          const user = await client.users.fetch(userId);
          await user.send(text);
        } catch {
          console.log(`[Mensagem para ${userId}]: ${text}`);
        }
      },
    };

    // Marca que o usuário começou o chat
    userStep.set(userId, 0);
    userFilters.set(userId, {});

    await handleGreeting(mockMessage, userId);

    const user = await client.users.fetch(userId).catch(() => null);
    setUser(userId, user, user.username);

    res.status(200).json({
      statusCode: 200,
      message: `Chat iniciado com o usuário ${userId}`,
      username: user.username ?? null
    });
  } catch (err) {
    // Nunca retorna a stack trace
    res.status(500).json({
      statusCode: 500,
      message: `erro ao prosseguir com a sua solicitacao no servidor. ${err.message}`,
      URI: req.originalUrl,
      timestamp: new Date().toISOString()
    });
  }
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Webhook iniciado!`));

// Função para setar o client Discord
function setDiscordClient(discordClient) {
  client = discordClient;
}

module.exports = { setDiscordClient };
