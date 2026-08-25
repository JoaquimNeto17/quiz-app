import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
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
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerPulse = useRef(new Animated.Value(1)).current;
  const questionOpacity = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    if (!isUrgent || status !== 'idle') {
      timerPulse.stopAnimation();
      timerPulse.setValue(1);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(timerPulse, { duration: 420, toValue: 0.55, useNativeDriver: true }),
        Animated.timing(timerPulse, { duration: 420, toValue: 1, useNativeDriver: true }),
      ]),
    );

    pulse.start();
    return () => pulse.stop();
  }, [isUrgent, status, timerPulse]);

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
    if (isTransitioning) return;

    if (currentIndex === quiz.length - 1) {
      setFinished(true);
      return;
    }

    setIsTransitioning(true);
    Animated.timing(questionOpacity, {
      duration: 100,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((value) => value + 1);
      setSelectedOption(null);
      setHoveredOption(null);
      setStatus('idle');
      setTimeLeft(QUESTION_TIME);

      Animated.timing(questionOpacity, {
        duration: 180,
        toValue: 1,
        useNativeDriver: true,
      }).start(() => setIsTransitioning(false));
    });
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
    setHoveredOption(null);
    setIsTransitioning(false);
    questionOpacity.setValue(1);
  }

  function optionState(option: string) {
    if (status === 'idle' && hoveredOption === option) return [styles.option, styles.optionHover];
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
            <Ionicons color="#183F35" name="arrow-back" size={20} />
          </Pressable>

          <View style={styles.headerCopy}>
            <Text style={styles.brand}>HISTÓRIA EM JOGO</Text>
            <Text style={styles.counter}>QUESTÃO {currentIndex + 1} DE {quiz.length}</Text>
          </View>

          <View style={styles.scorePanel}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreNumber}>{score}</Text>
              <Text style={styles.scoreLabel}>ACERTOS</Text>
            </View>
            <View style={styles.scoreDivider} />
            <View style={styles.scoreItem}>
              <Text style={styles.scoreNumber}>{streak}</Text>
              <Text style={styles.scoreLabel}>SEQUÊNCIA</Text>
            </View>
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
        </View>

        <Animated.View style={[styles.animatedContent, { opacity: questionOpacity }]}>
          <View style={[styles.content, compact && styles.contentCompact]}>
            <View style={styles.questionArea}>
              <View style={styles.timerRow}>
                <Animated.View
                  style={[
                    styles.timerBox,
                    isUrgent && styles.timerBoxUrgent,
                    { opacity: timerPulse },
                  ]}
                >
                  <Text style={styles.timerNumber}>{timeLeft}</Text>
                </Animated.View>
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
              {currentQuestion.options.map((option, index) => {
                const isHovered = status === 'idle' && hoveredOption === option;
                const isCorrect = status !== 'idle' && option === currentQuestion.correctAnswer;
                const isWrong = status === 'answered' && option === selectedOption && !answeredCorrectly;

                return (
                  <Pressable
                    accessibilityLabel={`Alternativa ${String.fromCharCode(65 + index)}: ${option}`}
                    accessibilityRole="button"
                    accessibilityState={{
                      disabled: status !== 'idle',
                      selected: selectedOption === option,
                    }}
                    disabled={status !== 'idle'}
                    key={option}
                    onHoverIn={() => setHoveredOption(option)}
                    onHoverOut={() => setHoveredOption(null)}
                    onPress={() => selectAnswer(option)}
                    style={({ pressed }) => [
                      optionState(option),
                      compact && styles.optionCompact,
                      pressed && styles.optionPressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.optionLetterBox,
                        isHovered && styles.optionLetterBoxHover,
                        isCorrect && styles.optionLetterBoxCorrect,
                        isWrong && styles.optionLetterBoxWrong,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionLetter,
                          (isHovered || isCorrect || isWrong) && styles.optionLetterInverted,
                        ]}
                      >
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={2}
                      style={[styles.optionText, isHovered && styles.optionTextHover]}
                    >
                      {option}
                    </Text>
                    {isCorrect ? <Ionicons color="#226149" name="checkmark-circle" size={21} /> : null}
                    {isWrong ? <Ionicons color="#B6533C" name="close-circle" size={21} /> : null}
                  </Pressable>
                );
              })}
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
                disabled={isTransitioning}
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
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#F7F3E8', flex: 1 },
  page: { flex: 1, marginHorizontal: 'auto', maxWidth: 1120, padding: 24, width: '100%' },
  pageCompact: { padding: 13 },
  header: { alignItems: 'center', flexDirection: 'row', minHeight: 50 },
  backButton: { alignItems: 'center', borderColor: '#183F35', borderWidth: 1, height: 40, justifyContent: 'center', width: 40 },
  headerCopy: { flex: 1, marginLeft: 11 },
  brand: { color: '#17231F', fontSize: 13, fontWeight: '900', letterSpacing: 1.1 },
  counter: { color: '#68736D', fontSize: 9, fontWeight: '800', letterSpacing: 0.9, marginTop: 3 },
  scorePanel: { alignItems: 'center', backgroundColor: '#E6EEE7', borderColor: '#183F35', borderWidth: 1, flexDirection: 'row', minHeight: 46, paddingHorizontal: 13 },
  scoreItem: { alignItems: 'center', minWidth: 56 },
  scoreDivider: { backgroundColor: '#97AA9E', height: 27, marginHorizontal: 8, width: 1 },
  scoreNumber: { color: '#183F35', fontSize: 19, fontWeight: '900', lineHeight: 20 },
  scoreLabel: { color: '#52645B', fontSize: 7, fontWeight: '900', letterSpacing: 0.8, marginTop: 2 },
  progressTrack: { backgroundColor: '#D5DDD7', borderColor: '#183F35', borderWidth: 1, height: 6, marginTop: 10 },
  progressFill: { backgroundColor: '#D3A43B', height: '100%' },
  metaRow: { alignItems: 'center', borderBottomColor: '#9CAE9F', borderBottomWidth: 1, flexDirection: 'row', minHeight: 39 },
  metaStrong: { color: '#226149', fontSize: 10, fontWeight: '900', letterSpacing: 0.7 },
  metaDivider: { color: '#A38B57', fontSize: 11, marginHorizontal: 9 },
  metaText: { color: '#4C5A54', fontSize: 10, fontWeight: '700' },
  animatedContent: { flex: 1 },
  content: { flex: 1, justifyContent: 'flex-start', paddingTop: 22 },
  contentCompact: { paddingTop: 9 },
  questionArea: { marginBottom: 13 },
  timerRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 12 },
  timerBox: { alignItems: 'center', backgroundColor: '#183F35', height: 48, justifyContent: 'center', marginRight: 13, width: 48 },
  timerBoxUrgent: { backgroundColor: '#B6533C' },
  timerNumber: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  timerCopy: { flex: 1 },
  timerLabel: { color: '#405049', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  timerTrack: { backgroundColor: '#D6DDD7', height: 5, marginTop: 7 },
  timerFill: { backgroundColor: '#226149', height: '100%' },
  timerFillUrgent: { backgroundColor: '#B6533C' },
  urgent: { color: '#B6533C' },
  questionPaper: { backgroundColor: '#FFFDF7', borderColor: '#183F35', borderWidth: 1, borderLeftWidth: 7, justifyContent: 'center', minHeight: 122, paddingHorizontal: 27, paddingVertical: 18, shadowColor: '#183F35', shadowOffset: { height: 3, width: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  questionPaperCompact: { minHeight: 92, paddingHorizontal: 17, paddingVertical: 12 },
  questionIndex: { color: '#A07825', fontSize: 9, fontWeight: '900', letterSpacing: 1.2, marginBottom: 7 },
  questionText: { color: '#17231F', fontFamily: 'serif', fontSize: 24, fontWeight: '800', lineHeight: 30 },
  questionTextCompact: { fontSize: 18, lineHeight: 23 },
  optionsArea: { gap: 8 },
  option: { alignItems: 'center', backgroundColor: '#FFFDF7', borderColor: '#A7B4AA', borderWidth: 1, flexDirection: 'row', minHeight: 52, paddingHorizontal: 11 },
  optionCompact: { minHeight: 44 },
  optionHover: { backgroundColor: '#183F35', borderColor: '#183F35' },
  optionPressed: { opacity: 0.78, transform: [{ translateX: 2 }] },
  optionCorrect: { backgroundColor: '#E1EFE6', borderColor: '#226149', borderWidth: 3 },
  optionWrong: { backgroundColor: '#F7E5E0', borderColor: '#B6533C', borderWidth: 3 },
  optionMuted: { opacity: 0.52 },
  optionLetterBox: { alignItems: 'center', backgroundColor: '#E4EBE5', height: 31, justifyContent: 'center', marginRight: 13, width: 31 },
  optionLetterBoxHover: { backgroundColor: '#D3A43B' },
  optionLetterBoxCorrect: { backgroundColor: '#226149' },
  optionLetterBoxWrong: { backgroundColor: '#B6533C' },
  optionLetter: { color: '#183F35', fontSize: 13, fontWeight: '900' },
  optionLetterInverted: { color: '#FFFFFF' },
  optionText: { color: '#21302A', flex: 1, fontSize: 14, fontWeight: '700', lineHeight: 19 },
  optionTextHover: { color: '#FFFFFF' },
  feedback: { alignItems: 'center', borderTopColor: '#9CAE9F', borderTopWidth: 1, flexDirection: 'row', gap: 18, minHeight: 78, paddingTop: 11 },
  feedbackCompact: { minHeight: 64, paddingTop: 7 },
  feedbackCopy: { flex: 1 },
  feedbackTitle: { color: '#183F35', fontSize: 17, fontWeight: '900' },
  explanation: { color: '#526159', fontSize: 11, lineHeight: 16, marginTop: 3 },
  nextButton: { alignItems: 'center', backgroundColor: '#183F35', borderColor: '#183F35', borderWidth: 1, flexDirection: 'row', gap: 9, minHeight: 44, paddingHorizontal: 17, shadowColor: '#D3A43B', shadowOffset: { height: 3, width: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  nextButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  instructionRow: { borderTopColor: '#9CAE9F', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 },
  instruction: { color: '#53635B', fontSize: 8, fontWeight: '900', letterSpacing: 0.9 },
  pressed: { opacity: 0.72 },
});