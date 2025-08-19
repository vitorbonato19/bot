// questionService.js

const questions = [
  {
    key: 'pmin',
    question: 'Selecione o preço mínimo:',
    type: 'float',
    optional: true,
    options: [
      { label: '0', value: '0' },
      { label: '10', value: '10' },
      { label: '50', value: '50' },
      { label: '100', value: '100' },
      { label: '500', value: '500' },
      { label: '1000', value: '1000' },
      { label: 'Sem preço mínimo', value: 'none' }
    ]
  },
  {
    key: 'pmax',
    question: 'Selecione o preço máximo:',
    type: 'float',
    optional: true,
    options: [
      { label: '0', value: '0' },
      { label: '10', value: '10' },
      { label: '50', value: '50' },
      { label: '100', value: '100' },
      { label: '500', value: '500' },
      { label: '1000', value: '1000' },
      { label: '2000', value: '2000' },
      { label: 'Sem preço máximo', value: 'none' }
    ]
  },
  {
    key: 'gmax',
    question: 'Número máximo de jogos?',
    type: 'int',
    optional: true,
    options: [
      { label: '0', value: '0' },
      { label: '10', value: '10' },
      { label: '50', value: '50' },
      { label: '100', value: '100' },
      { label: 'Sem número máximo de jogos', value: 'none' }
    ]
  },
  {
    key: 'gmin',
    question: 'Número mínimo de jogos?',
    type: 'int',
    optional: true,
    options: [
      { label: '0', value: '0' },
      { label: '1', value: '1' },
      { label: '5', value: '5' },
      { label: '20', value: '20' },
      { label: 'Sem número mínimo de jogos', value: 'none' }
    ]
  },
  {
    key: 'origin',
    question: 'País de origem?',
    type: 'array',
    optional: true,
    options: [
      { label: 'Brasil', value: 'BR' },
      { label: 'Estados Unidos', value: 'US' },
      { label: 'Alemanha', value: 'DE' },
      { label: 'Sem País de Origem', value: 'none' }
    ]
  },
  {
    key: 'currency',
    question: 'Qual moeda será transacionada a conta?',
    type: 'string',
    optional: false,
    options: [
      { label: 'Real (BRL)', value: 'BRL' },
      { label: 'Dólar (USD)', value: 'USD' },
      { label: 'Euro (EUR)', value: 'EUR' }
    ]
  },
  {
    key: 'email_login_data',
    question: 'Conta terá email associado?',
    type: 'boolean',
    optional: true,
    options: [
      { label: 'Sim', value: 'true' },
      { label: 'Não', value: 'false' }
    ]
  },
];

module.exports = { questions };
