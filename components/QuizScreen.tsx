import { useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import questions from '../question.json';

type Question = (typeof questions)[number];

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function createQuiz(): Question[] {
  return shuffle(questions).map((question) => ({
    ...question,
    options: shuffle(question.options),
  }));
}

export default function QuizScreen() {
  const initialQuiz = useMemo(createQuiz, []);
  const [quizQuestions, setQuizQuestions] = useState(initialQuiz);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const currentQuestion = quizQuestions[currentIndex];
  const progress = ((currentIndex + 1) / quizQuestions.length) * 100;

  function answer(option: string) {
    if (selectedOption) return;
    setSelectedOption(option);
    if (option === currentQuestion.correctAnswer) setScore((value) => value + 1);
  }

  function next() {
    if (currentIndex === quizQuestions.length - 1) return setFinished(true);
    setCurrentIndex((value) => value + 1);
    setSelectedOption(null);
  }

  function restart() {
    setQuizQuestions(createQuiz());
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setFinished(false);
  }

  function optionStyle(option: string) {
    if (!selectedOption) return styles.option;
    if (option === currentQuestion.correctAnswer) return [styles.option, styles.correct];
    if (option === selectedOption) return [styles.option, styles.incorrect];
    return [styles.option, styles.disabled];
  }

  if (finished) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.resultContainer}>
          <Text style={styles.eyebrow}>QUIZ FINALIZADO</Text>
          <Text style={styles.resultTitle}>Seu resultado</Text>
          <Text style={styles.resultScore}>{score}/{quizQuestions.length}</Text>
          <Text style={styles.percentage}>{percentage}% de acertos</Text>
          <Text style={styles.resultMessage}>
            {percentage >= 70
              ? 'Muito bem! Você demonstrou um ótimo conhecimento.'
              : 'Continue praticando. Na próxima rodada, a ordem será diferente.'}
          </Text>
          <TouchableOpacity accessibilityRole="button" onPress={restart} style={styles.button}>
            <Text style={styles.buttonText}>Jogar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>DESAFIO DE CONHECIMENTOS</Text>
            <Text style={styles.title}>Quiz App</Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreLabel}>PONTOS</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
        </View>

        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>Pergunta {currentIndex + 1} de {quizQuestions.length}</Text>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              accessibilityRole="button"
              disabled={Boolean(selectedOption)}
              key={option}
              onPress={() => answer(option)}
              style={optionStyle(option)}
            >
              <Text style={styles.optionLetter}>{String.fromCharCode(65 + index)}</Text>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedOption && (
          <View style={styles.feedbackArea}>
            <Text style={selectedOption === currentQuestion.correctAnswer ? styles.correctText : styles.incorrectText}>
              {selectedOption === currentQuestion.correctAnswer
                ? 'Resposta correta!'
                : `Resposta correta: ${currentQuestion.correctAnswer}`}
            </Text>
            <TouchableOpacity accessibilityRole="button" onPress={next} style={styles.button}>
              <Text style={styles.buttonText}>
                {currentIndex === quizQuestions.length - 1 ? 'Ver resultado' : 'Próxima pergunta'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#08152F' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  eyebrow: { color: '#F59E0B', fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', marginTop: 2 },
  scoreBadge: { alignItems: 'center', backgroundColor: '#12264D', borderColor: '#294570', borderRadius: 14, borderWidth: 1, minWidth: 70, padding: 9 },
  scoreLabel: { color: '#90A4C5', fontSize: 10, fontWeight: '700' },
  scoreValue: { color: '#FFFFFF', fontSize: 21, fontWeight: '800' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { color: '#AFC0DC', fontSize: 13, fontWeight: '600' },
  progressTrack: { backgroundColor: '#1B3156', borderRadius: 5, height: 8, marginBottom: 24, marginTop: 8, overflow: 'hidden' },
  progressBar: { backgroundColor: '#F59E0B', borderRadius: 5, height: '100%' },
  questionCard: { backgroundColor: '#102447', borderColor: '#294570', borderRadius: 20, borderWidth: 1, justifyContent: 'center', marginBottom: 18, minHeight: 130, padding: 22 },
  questionText: { color: '#FFFFFF', fontSize: 21, fontWeight: '700', lineHeight: 29, textAlign: 'center' },
  optionsContainer: { gap: 11 },
  option: { alignItems: 'center', backgroundColor: '#102447', borderColor: '#294570', borderRadius: 14, borderWidth: 1, flexDirection: 'row', minHeight: 58, padding: 10 },
  optionLetter: { backgroundColor: '#1D3763', borderRadius: 10, color: '#F8FAFC', fontSize: 15, fontWeight: '800', marginRight: 12, overflow: 'hidden', paddingHorizontal: 12, paddingVertical: 8, textAlign: 'center' },
  optionText: { color: '#E8EEF8', flex: 1, fontSize: 16, fontWeight: '600' },
  correct: { backgroundColor: '#0E493D', borderColor: '#34D399' },
  incorrect: { backgroundColor: '#532337', borderColor: '#FB7185' },
  disabled: { opacity: 0.48 },
  feedbackArea: { marginTop: 18 },
  correctText: { color: '#6EE7B7', fontSize: 15, fontWeight: '700', marginBottom: 10 },
  incorrectText: { color: '#FDA4AF', fontSize: 15, fontWeight: '700', marginBottom: 10 },
  button: { alignItems: 'center', backgroundColor: '#F59E0B', borderRadius: 14, justifyContent: 'center', minHeight: 54, paddingHorizontal: 24 },
  buttonText: { color: '#1A1305', fontSize: 16, fontWeight: '800' },
  resultContainer: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 28 },
  resultTitle: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', marginTop: 8 },
  resultScore: { color: '#F59E0B', fontSize: 70, fontWeight: '900', marginTop: 20 },
  percentage: { color: '#FFFFFF', fontSize: 19, fontWeight: '700' },
  resultMessage: { color: '#AFC0DC', fontSize: 16, lineHeight: 24, marginBottom: 28, marginTop: 14, maxWidth: 340, textAlign: 'center' },
});