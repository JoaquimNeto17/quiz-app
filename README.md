# Quiz App

Aplicativo de perguntas e respostas desenvolvido com React Native e Expo. O jogador responde a questões de conhecimentos gerais, acompanha sua pontuação e recebe o resultado ao final da partida.

## Funcionalidades

- 20 perguntas de conhecimentos gerais
- Pontuação, barra de progresso e feedback visual
- Indicação da resposta correta após um erro
- Tela final com pontuação e porcentagem de acertos
- Opção de jogar novamente
- Layout para Android, iOS e web

## Nova funcionalidade: quiz aleatório

As perguntas e suas alternativas são embaralhadas com o algoritmo Fisher–Yates sempre que uma partida começa. Ao selecionar **Jogar novamente**, uma nova sequência é criada.

Isso torna o jogo mais desafiador e aumenta a rejogabilidade, pois o jogador não pode depender da posição anterior das perguntas ou respostas. O algoritmo mantém os dados originais de `question.json` intactos.

## Tecnologias

- React Native
- Expo SDK 54
- Expo Router
- TypeScript
- JSON

## Pré-requisitos

- Node.js 20.19 ou superior
- npm
- Expo Go no celular, ou um navegador/emulador

## Como executar

1. Clone e acesse o projeto:

   ```bash
   git clone https://github.com/JoaquimNeto17/quiz-app.git
   cd quiz-app
   ```

2. Instale as dependências e inicie o Expo:

   ```bash
   npm install
   npx expo start
   ```

3. Escaneie o QR Code com o Expo Go ou pressione `a` para Android, `i` para iOS ou `w` para navegador.

## Estrutura principal

```text
quiz-app/
├── app/
│   ├── _layout.tsx
│   └── index.tsx
├── components/
│   └── QuizScreen.tsx
├── assets/
├── question.json
├── app.json
└── package.json
```

## Como adicionar perguntas

Inclua um objeto em `question.json` seguindo o formato:

```json
{
  "question": "Qual é a capital do Brasil?",
  "options": ["Brasília", "São Paulo", "Salvador", "Curitiba"],
  "correctAnswer": "Brasília"
}
```

O valor de `correctAnswer` deve ser exatamente igual a uma das alternativas de `options`.

## Autor

Desenvolvido por [Joaquim Neto](https://github.com/JoaquimNeto17).
