const { handleGreeting } = require('./greetingHandler');
const { handleInteraction } = require('./interactionHandler');
const { handleFilterAnswer, userStep, userFilters } = require('./filterQuestionsHandler');

async function handleMessage(client, message) {
  if (message.author.bot) return;

  const userId = message.author.id;

  if (userStep.has(userId)) {
    await handleFilterAnswer(message);
    return;
  }

  const content = message.content.toLowerCase().trim();

  if (content === 'oi' || content === 'olá' || content === 'oii' || content === 'e aí') {
    await handleGreeting(message);
  } else if (content === 'reset') {
    // Reseta os dados do usuário
    userStep.delete(userId);
    userFilters.delete(userId);
    await handleGreeting(message); // Reinicia com a saudação
    await message.reply('✅ Chat resetado! Vamos começar de novo.');
  }
}

module.exports = {
  handleMessage,
  handleInteraction: require('./interactionHandler').handleInteraction,
};
