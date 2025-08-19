const { handleGreeting } = require('../../main/greetingHandler');
const { userStep, userFilters } = require('../../main/filterQuestionsHandler');

async function onWebhookReceived(interaction) {
  // Pega o ID do usuário (ou cria um ID genérico)
  const userId = interaction.user?.id || 'webhook-user';

  // Cria um objeto "mock" de message
  const mockMessage = {
    author: { id: userId, bot: false },
    reply: async (text) => {
      // Se quiser enviar pelo webhook real do Discord:
      // interaction.channel.send(text);
      console.log(`[Mensagem para ${userId}]: ${text}`);
    },
  };

  // Inicializa o estado do usuário
  userStep.set(userId, 0);
  userFilters.set(userId, {});

  // Inicia o chatbot como se fosse um "oi"
  await handleGreeting(mockMessage);
}

module.exports = { onWebhookReceived };
