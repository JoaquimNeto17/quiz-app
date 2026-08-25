# História em Jogo

Aplicativo educacional de perguntas e respostas sobre História do Brasil e História Mundial, desenvolvido com React Native, TypeScript e Expo.

O jogador percorre diferentes períodos históricos, responde a questões com tempo limitado e recebe uma explicação depois de cada resposta. O objetivo é unir desafio, revisão de conteúdo e aprendizado em uma interface editorial clara, inspirada em livros e linhas do tempo.

## Funcionalidades

- 50 questões históricas
- 25 questões de História do Brasil
- 25 questões de História Mundial
- Timer de 20 segundos por pergunta
- Perguntas e alternativas embaralhadas a cada partida
- Identificação por categoria, período e dificuldade
- Explicação histórica após cada resposta
- Feedback visual para acertos, erros e tempo esgotado
- Sistema de pontos
- Contagem de sequência de acertos
- Barra de progresso da partida
- Classificação final de acordo com o desempenho
- Layout responsivo para celular, computador e navegador
- Telas principais sem rolagem: todo o conteúdo cabe na área visível

## Nova funcionalidade: timer por pergunta

Cada pergunta começa com uma contagem regressiva de 20 segundos. O timer é interrompido assim que o jogador escolhe uma alternativa.

Quando restam cinco segundos, o contador e sua barra mudam para vermelho. Se o tempo chegar a zero, a questão é encerrada, a sequência de acertos é reiniciada e a resposta correta aparece acompanhada de uma explicação histórica.

O timer é reiniciado automaticamente ao avançar para a próxima pergunta.

## Banco de questões

As perguntas estão armazenadas no arquivo `question.json`. Cada questão possui a seguinte estrutura:

```json
{
  "category": "Brasil",
  "period": "Era Vargas",
  "difficulty": "Médio",
  "question": "Quem chegou ao poder após a Revolução de 1930?",
  "options": [
    "Juscelino Kubitschek",
    "Getúlio Vargas",
    "Eurico Gaspar Dutra",
    "Jânio Quadros"
  ],
  "correctAnswer": "Getúlio Vargas",
  "explanation": "A Revolução de 1930 encerrou a Primeira República e levou Getúlio Vargas ao governo."
}
```

O valor de `correctAnswer` deve ser exatamente igual a uma das alternativas presentes em `options`.

## Identidade visual

O redesign utiliza uma linguagem editorial leve, com poucos elementos decorativos e hierarquia tipográfica clara:

| Elemento | Cor |
| --- | --- |
| Fundo principal | Marfim `#F3EFE6` |
| Superfície | Papel claro `#FAF8F2` |
| Texto principal | Azul profundo `#17324D` |
| Destaque | Terracota `#9B3E32` |
| Bordas | Bege acinzentado `#D7D0C3` |

O arquivo `_layout.tsx` aplica o tema claro global, define o fundo das rotas e configura as transições entre a página inicial e o quiz. `HomeScreen`, `QuizScreen` e `ResultScreen` usam composição responsiva sem `ScrollView`, evitando barras de rolagem nas telas principais.

## Tecnologias

- React 19
- React Native 0.81
- Expo SDK 54
- Expo Router
- TypeScript
- Ionicons
- JSON

## Pré-requisitos

- Node.js 20.19 ou superior
- npm
- Expo Go no celular, navegador ou emulador

## Instalação

Clone o repositório:

```bash
git clone https://github.com/JoaquimNeto17/quiz-app.git
cd quiz-app
```

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npx expo start
```

No terminal do Expo, utilize:

- `a` para abrir no Android
- `i` para abrir no iOS
- `w` para abrir no navegador

Para iniciar limpando o cache:

```bash
npx expo start -c
```

## Estrutura do projeto

```text
quiz-app/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── quiz.tsx
├── components/
│   ├── HomeScreen.tsx
│   ├── QuizScreen.tsx
│   └── ResultScreen.tsx
├── assets/
├── question.json
├── app.json
├── package.json
└── README.md
```

## Fluxo do aplicativo

1. `index.tsx` abre o componente `HomeScreen`.
2. O botão **Iniciar jornada** navega para a rota `/quiz`.
3. `QuizScreen` embaralha as perguntas e inicia o timer.
4. Depois de cada resposta, uma explicação histórica é apresentada.
5. Ao concluir a última pergunta, `ResultScreen` apresenta a pontuação, os erros e a melhor sequência.
6. O jogador pode refazer a jornada ou voltar à tela inicial.

## Como adicionar uma questão

1. Abra `question.json`.
2. Adicione um novo objeto seguindo o modelo apresentado neste README.
3. Utilize `Brasil` ou `Mundo` no campo `category`.
4. Garanta que existam exatamente quatro alternativas.
5. Confira se `correctAnswer` corresponde exatamente a uma alternativa.
6. Adicione uma explicação curta e objetiva.

## Autor

Desenvolvido por [Joaquim Neto](https://github.com/JoaquimNeto17).
