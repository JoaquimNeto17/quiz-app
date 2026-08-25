import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

type ResultScreenProps = {
  score: number;
  totalQuestions: number;
  bestStreak: number;
  onPlayAgain: () => void;
};

export default function ResultScreen({
  score,
  totalQuestions,
  bestStreak,
  onPlayAgain,
}: ResultScreenProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const errors = totalQuestions - score;

  const getMessage = () => {
    if (percentage >= 90) return 'Desempenho excelente';
    if (percentage >= 70) return 'Muito bom resultado';
    if (percentage >= 50) return 'Bom progresso';
    return 'Continue praticando';
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.brand}>Knowledge Lab</Text>
        <Text style={styles.title}>Resultado final</Text>
        <Text style={styles.subtitle}>{getMessage()}</Text>

        <View style={styles.scoreCircle}>
          <Text style={styles.percentage}>{percentage}%</Text>
          <Text style={styles.scoreDetail}>{score} de {totalQuestions}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, styles.correct]}>{score}</Text>
            <Text style={styles.statLabel}>Acertos</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, styles.error]}>{errors}</Text>
            <Text style={styles.statLabel}>Erros</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, styles.streak]}>{bestStreak}x</Text>
            <Text style={styles.statLabel}>Melhor sequência</Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={onPlayAgain}>
          <Text style={styles.buttonText}>Jogar novamente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FB', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 540, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D9E2EC', borderRadius: 14, paddingHorizontal: 26, paddingVertical: 32, alignItems: 'center' },
  brand: { color: '#214E7A', fontSize: 13, fontWeight: '800', letterSpacing: 0.2, marginBottom: 10 },
  title: { color: '#17324D', fontSize: 34, lineHeight: 40, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#66788A', fontSize: 15, fontWeight: '500', marginTop: 7, marginBottom: 26 },
  scoreCircle: { width: 170, height: 170, borderRadius: 85, borderWidth: 8, borderColor: '#F47C20', backgroundColor: '#FFF8F2', alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  percentage: { color: '#17324D', fontSize: 44, fontWeight: '800' },
  scoreDetail: { color: '#66788A', fontSize: 13, fontWeight: '700', marginTop: 3 },
  stats: { width: '100%', minHeight: 96, backgroundColor: '#F7F9FC', borderWidth: 1, borderColor: '#D9E2EC', borderRadius: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  stat: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  separator: { width: 1, height: 42, backgroundColor: '#D9E2EC' },
  statValue: { color: '#17324D', fontSize: 24, fontWeight: '800' },
  statLabel: { color: '#66788A', fontSize: 9, fontWeight: '700', letterSpacing: 0.1, marginTop: 5, textAlign: 'center' },
  correct: { color: '#22C55E' },
  error: { color: '#EF4444' },
  streak: { color: '#F47C20' },
  button: { width: '100%', minHeight: 60, backgroundColor: '#F47C20', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
});