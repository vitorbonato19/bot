const { handleGreeting } = require('./greetingHandler');
const { handleInteraction } = require('./interactionHandler');
const { handleFilterAnswer } = require('./filterQuestionsHandler');

async function handleMessage(client, message) {
  if (message.author.bot) return;

  const userId = message.author.id;

  // Supondo que você tenha um controle global para estado do usuário, importado aqui
  const { userStep } = require('./filterQuestionsHandler');

  if (userStep.has(userId)) {
    await handleFilterAnswer(message);
    return;
  }

  const content = message.content.toLowerCase().trim();

  if (content === 'oi' || content === 'olá' || content === 'oii' || content === 'e aí') {
    await handleGreeting(message);
  }
}

module.exports = {
  handleMessage,
  handleInteraction: require('./interactionHandler').handleInteraction,
};
