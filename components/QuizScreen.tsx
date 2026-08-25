import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import questions from '../question.json';
import ResultScreen from './ResultScreen';

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
  category?: 'Brasil' | 'Mundo';
  period?: string;
  difficulty?: string;
  explanation?: string;
};

type AnswerStatus = 'idle' | 'answered' | 'timeout';

const QUESTION_TIME = 20;
const questionBank = questions as unknown as Question[];

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createQuiz() {
  return shuffle(questionBank).map((question) => ({
    ...question,
    options: shuffle(question.options),
  }));
}

export default function QuizScreen() {
  const { height, width } = useWindowDimensions();
  const compact = height < 760 || width < 680;
  const [quiz, setQuiz] = useState<Question[]>(createQuiz);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<AnswerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQuestion = quiz[currentIndex];
  const progress = ((currentIndex + 1) / quiz.length) * 100;
  const timeProgress = (timeLeft / QUESTION_TIME) * 100;
  const isUrgent = timeLeft <= 5;
  const answeredCorrectly = selectedOption === currentQuestion?.correctAnswer;

  useEffect(() => {
    if (status !== 'idle' || finished) return;

    if (timeLeft === 0) {
      setStatus('timeout');
      setStreak(0);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [finished, status, timeLeft]);

  function selectAnswer(option: string) {
    if (status !== 'idle') return;

    setSelectedOption(option);
    setStatus('answered');

    if (option === currentQuestion.correctAnswer) {
      setScore((value) => value + 1);
      setStreak((value) => {
        const nextStreak = value + 1;
        setBestStreak((best) => Math.max(best, nextStreak));
        return nextStreak;
      });
    } else {
      setStreak(0);
    }
  }

  function nextQuestion() {
    if (currentIndex === quiz.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentIndex((value) => value + 1);
    setSelectedOption(null);
    setStatus('idle');
    setTimeLeft(QUESTION_TIME);
  }

  function restartQuiz() {
    setQuiz(createQuiz());
    setCurrentIndex(0);
    setSelectedOption(null);
    setStatus('idle');
    setTimeLeft(QUESTION_TIME);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setFinished(false);
  }

  function optionState(option: string) {
    if (status === 'idle') return styles.option;
    if (option === currentQuestion.correctAnswer) return [styles.option, styles.optionCorrect];
    if (option === selectedOption) return [styles.option, styles.optionWrong];
    return [styles.option, styles.optionMuted];
  }

  if (finished) {
    return (
      <ResultScreen
        bestStreak={bestStreak}
        onGoHome={() => router.replace('/')}
        onPlayAgain={restartQuiz}
        score={score}
        total={quiz.length}
      />
    );
  }

  const category = currentQuestion.category ?? 'História';
  const period = currentQuestion.period ?? 'Período histórico';
  const difficulty = currentQuestion.difficulty ?? 'Médio';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.page, compact && styles.pageCompact]}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Voltar para a tela inicial"
            accessibilityRole="button"
            onPress={() => router.replace('/')}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Ionicons color="#17324D" name="arrow-back" size={20} />
          </Pressable>

          <View style={styles.headerCopy}>
            <Text style={styles.brand}>HISTÓRIA EM JOGO</Text>
            <Text style={styles.counter}>QUESTÃO {currentIndex + 1} DE {quiz.length}</Text>
          </View>

          <View style={styles.scoreBlock}>
            <Text style={styles.scoreNumber}>{score}</Text>
            <Text style={styles.scoreLabel}>ACERTOS</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaStrong}>{category}</Text>
          <Text style={styles.metaDivider}>/</Text>
          <Text style={styles.metaText}>{period}</Text>
          <Text style={styles.metaDivider}>/</Text>
          <Text style={styles.metaText}>{difficulty}</Text>
          <View style={styles.metaSpacer} />
          <Text style={styles.streak}>SEQUÊNCIA {streak}</Text>
        </View>

        <View style={[styles.content, compact && styles.contentCompact]}>
          <View style={styles.questionArea}>
            <View style={styles.timerRow}>
              <Text style={[styles.timerNumber, isUrgent && styles.urgent]}>{timeLeft}</Text>
              <View style={styles.timerCopy}>
                <Text style={[styles.timerLabel, isUrgent && styles.urgent]}>
                  SEGUNDOS PARA RESPONDER
                </Text>
                <View style={styles.timerTrack}>
                  <View
                    style={[
                      styles.timerFill,
                      isUrgent && styles.timerFillUrgent,
                      { width: `${timeProgress}%` },
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={[styles.questionPaper, compact && styles.questionPaperCompact]}>
              <Text style={styles.questionIndex}>PERGUNTA {String(currentIndex + 1).padStart(2, '0')}</Text>
              <Text
                numberOfLines={compact ? 3 : 4}
                style={[styles.questionText, compact && styles.questionTextCompact]}
              >
                {currentQuestion.question}
              </Text>
            </View>
          </View>

          <View style={styles.optionsArea}>
            {currentQuestion.options.map((option, index) => (
              <Pressable
                accessibilityRole="button"
                disabled={status !== 'idle'}
                key={option}
                onPress={() => selectAnswer(option)}
                style={({ pressed }) => [
                  optionState(option),
                  compact && styles.optionCompact,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.optionLetter}>{String.fromCharCode(65 + index)}</Text>
                <Text numberOfLines={2} style={styles.optionText}>{option}</Text>
                {status !== 'idle' && option === currentQuestion.correctAnswer && (
                  <Ionicons color="#35715D" name="checkmark" size={20} />
                )}
                {status === 'answered' && option === selectedOption && !answeredCorrectly && (
                  <Ionicons color="#A4463B" name="close" size={20} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {status !== 'idle' ? (
          <View style={[styles.feedback, compact && styles.feedbackCompact]}>
            <View style={styles.feedbackCopy}>
              <Text style={styles.feedbackTitle}>
                {status === 'timeout'
                  ? 'Tempo esgotado'
                  : answeredCorrectly
                    ? 'Resposta correta'
                    : 'Resposta incorreta'}
              </Text>
              <Text numberOfLines={compact ? 2 : 3} style={styles.explanation}>
                {currentQuestion.explanation ?? `A resposta correta é ${currentQuestion.correctAnswer}.`}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={nextQuestion}
              style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}
            >
              <Text style={styles.nextButtonText}>
                {currentIndex === quiz.length - 1 ? 'Ver resultado' : 'Próxima'}
              </Text>
              <Ionicons color="#FFFFFF" name="arrow-forward" size={17} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.instructionRow}>
            <Text style={styles.instruction}>ESCOLHA UMA ALTERNATIVA</Text>
            <Text style={styles.instruction}>BRASIL E HISTÓRIA MUNDIAL</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#F3EFE6', flex: 1 },
  page: { flex: 1, marginHorizontal: 'auto', maxWidth: 1180, padding: 26, width: '100%' },
  pageCompact: { padding: 14 },
  header: { alignItems: 'center', flexDirection: 'row', minHeight: 44 },
  backButton: { alignItems: 'center', height: 40, justifyContent: 'center', width: 40 },
  headerCopy: { flex: 1, marginLeft: 8 },
  brand: { color: '#17324D', fontSize: 12, fontWeight: '900', letterSpacing: 1.2 },
  counter: { color: '#7D8283', fontSize: 8, fontWeight: '800', letterSpacing: 1, marginTop: 3 },
  scoreBlock: { alignItems: 'flex-end' },
  scoreNumber: { color: '#9B3E32', fontFamily: 'serif', fontSize: 24, fontWeight: '900', lineHeight: 25 },
  scoreLabel: { color: '#777E80', fontSize: 7, fontWeight: '800', letterSpacing: 1 },
  progressTrack: { backgroundColor: '#D9D3C7', height: 4, marginTop: 10 },
  progressFill: { backgroundColor: '#9B3E32', height: '100%' },
  metaRow: { alignItems: 'center', borderBottomColor: '#D7D0C3', borderBottomWidth: 1, flexDirection: 'row', minHeight: 36 },
  metaStrong: { color: '#9B3E32', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  metaDivider: { color: '#B0AAA0', fontSize: 10, marginHorizontal: 8 },
  metaText: { color: '#687276', fontSize: 9, fontWeight: '700' },
  metaSpacer: { flex: 1 },
  streak: { color: '#17324D', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  content: { flex: 1, justifyContent: 'center', paddingVertical: 18 },
  contentCompact: { paddingVertical: 8 },
  questionArea: { marginBottom: 15 },
  timerRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 10 },
  timerNumber: { color: '#17324D', fontFamily: 'serif', fontSize: 32, fontWeight: '900', minWidth: 50 },
  timerCopy: { flex: 1 },
  timerLabel: { color: '#687276', fontSize: 8, fontWeight: '900', letterSpacing: 1.1 },
  timerTrack: { backgroundColor: '#DCD6CB', height: 3, marginTop: 6 },
  timerFill: { backgroundColor: '#D19945', height: '100%' },
  timerFillUrgent: { backgroundColor: '#A4463B' },
  urgent: { color: '#A4463B' },
  questionPaper: { backgroundColor: '#FAF8F2', borderLeftColor: '#9B3E32', borderLeftWidth: 5, justifyContent: 'center', minHeight: 132, paddingHorizontal: 28, paddingVertical: 20 },
  questionPaperCompact: { minHeight: 96, paddingHorizontal: 18, paddingVertical: 13 },
  questionIndex: { color: '#9B3E32', fontSize: 8, fontWeight: '900', letterSpacing: 1.3, marginBottom: 8 },
  questionText: { color: '#17324D', fontFamily: 'serif', fontSize: 25, fontWeight: '800', lineHeight: 31 },
  questionTextCompact: { fontSize: 19, lineHeight: 24 },
  optionsArea: { gap: 8 },
  option: { alignItems: 'center', backgroundColor: '#FAF8F2', borderColor: '#D7D0C3', borderWidth: 1, flexDirection: 'row', minHeight: 54, paddingHorizontal: 15 },
  optionCompact: { minHeight: 45 },
  optionCorrect: { backgroundColor: '#E8F0E9', borderColor: '#6D9A85' },
  optionWrong: { backgroundColor: '#F5E8E5', borderColor: '#B87469' },
  optionMuted: { opacity: 0.55 },
  optionLetter: { color: '#9B3E32', fontFamily: 'serif', fontSize: 15, fontWeight: '900', width: 30 },
  optionText: { color: '#243C51', flex: 1, fontSize: 13, fontWeight: '700', lineHeight: 18 },
  feedback: { alignItems: 'center', borderTopColor: '#CFC7BA', borderTopWidth: 1, flexDirection: 'row', gap: 20, minHeight: 82, paddingTop: 12 },
  feedbackCompact: { minHeight: 66, paddingTop: 8 },
  feedbackCopy: { flex: 1 },
  feedbackTitle: { color: '#17324D', fontFamily: 'serif', fontSize: 17, fontWeight: '900' },
  explanation: { color: '#647075', fontSize: 10, lineHeight: 15, marginTop: 3 },
  nextButton: { alignItems: 'center', backgroundColor: '#9B3E32', flexDirection: 'row', gap: 9, minHeight: 44, paddingHorizontal: 17 },
  nextButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
  instructionRow: { borderTopColor: '#CFC7BA', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 11 },
  instruction: { color: '#858889', fontSize: 7, fontWeight: '800', letterSpacing: 1 },
  pressed: { opacity: 0.72 },
});
