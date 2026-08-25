import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

type ResultScreenProps = {
  score: number;
  total: number;
  bestStreak: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
};

function getResult(percentage: number) {
  if (percentage >= 90) return ['Mestre da História', 'Um resultado excepcional. Você domina os grandes acontecimentos.'];
  if (percentage >= 70) return ['Ótimo percurso', 'Seu conhecimento histórico está muito bem construído.'];
  if (percentage >= 50) return ['Boa jornada', 'Você reconhece os principais fatos e pode avançar ainda mais.'];
  return ['Continue explorando', 'Cada nova tentativa ajuda a conectar melhor os períodos históricos.'];
}

export default function ResultScreen({
  bestStreak,
  onGoHome,
  onPlayAgain,
  score,
  total,
}: ResultScreenProps) {
  const { height, width } = useWindowDimensions();
  const compact = height < 680 || width < 620;
  const percentage = Math.round((score / total) * 100);
  const errors = total - score;
  const [title, message] = getResult(percentage);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.page, compact && styles.pageCompact]}>
        <View style={styles.header}>
          <View style={styles.mark}><Text style={styles.markText}>H</Text></View>
          <View>
            <Text style={styles.brand}>HISTÓRIA EM JOGO</Text>
            <Text style={styles.brandCaption}>RESULTADO DA JORNADA</Text>
          </View>
        </View>

        <View style={[styles.main, compact && styles.mainCompact]}>
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowLine} />
            <Text style={styles.eyebrow}>PARTIDA CONCLUÍDA</Text>
          </View>

          <View style={styles.resultRow}>
            <View style={styles.percentageBlock}>
              <Text style={[styles.percentage, compact && styles.percentageCompact]}>{percentage}</Text>
              <Text style={styles.percentSign}>%</Text>
            </View>
            <View style={styles.resultDivider} />
            <View style={styles.resultCopy}>
              <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
            </View>
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{score}</Text>
              <Text style={styles.statLabel}>ACERTOS</Text>
            </View>
            <View style={styles.statRule} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{errors}</Text>
              <Text style={styles.statLabel}>ERROS</Text>
            </View>
            <View style={styles.statRule} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{bestStreak}</Text>
              <Text style={styles.statLabel}>MELHOR SEQUÊNCIA</Text>
            </View>
          </View>

          <View style={styles.note}>
            <Text style={styles.noteNumber}>{score}/{total}</Text>
            <Text style={styles.noteText}>
              respostas corretas em uma viagem por diferentes épocas do Brasil e do mundo.
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onPlayAgain}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.primaryButtonText}>Jogar novamente</Text>
              <Ionicons color="#FFFFFF" name="refresh" size={18} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onGoHome}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            >
              <Ionicons color="#183F35" name="home-outline" size={18} />
              <Text style={styles.secondaryButtonText}>Tela inicial</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>CONHECER O PASSADO. COMPREENDER O PRESENTE.</Text>
          <Text style={styles.footerText}>JOAQUIM NETO</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#F7F3E8', flex: 1 },
  page: { flex: 1, marginHorizontal: 'auto', maxWidth: 980, padding: 30, width: '100%' },
  pageCompact: { padding: 18 },
  header: { alignItems: 'center', borderBottomColor: '#9CAE9F', borderBottomWidth: 1, flexDirection: 'row', gap: 11, paddingBottom: 14 },
  mark: { alignItems: 'center', backgroundColor: '#183F35', borderColor: '#183F35', borderWidth: 2, height: 40, justifyContent: 'center', width: 40 },
  markText: { color: '#FFFFFF', fontFamily: 'serif', fontSize: 22, fontWeight: '900' },
  brand: { color: '#17231F', fontSize: 12, fontWeight: '900', letterSpacing: 1.2 },
  brandCaption: { color: '#A07825', fontSize: 7, fontWeight: '800', letterSpacing: 1.4, marginTop: 2 },
  main: { flex: 1, justifyContent: 'center', paddingVertical: 24 },
  mainCompact: { paddingVertical: 12 },
  eyebrowRow: { alignItems: 'center', flexDirection: 'row', gap: 9 },
  eyebrowLine: { backgroundColor: '#D3A43B', height: 3, width: 24 },
  eyebrow: { color: '#226149', fontSize: 8, fontWeight: '900', letterSpacing: 1.5 },
  resultRow: { alignItems: 'center', flexDirection: 'row', marginTop: 18 },
  percentageBlock: { alignItems: 'flex-start', flexDirection: 'row' },
  percentage: { color: '#183F35', fontFamily: 'serif', fontSize: 92, fontWeight: '900', letterSpacing: -4, lineHeight: 100 },
  percentageCompact: { fontSize: 62, lineHeight: 68 },
  percentSign: { color: '#D3A43B', fontFamily: 'serif', fontSize: 22, fontWeight: '900', marginLeft: 3, marginTop: 12 },
  resultDivider: { backgroundColor: '#D3A43B', height: 90, marginHorizontal: 30, width: 3 },
  resultCopy: { flex: 1 },
  title: { color: '#17231F', fontFamily: 'serif', fontSize: 31, fontWeight: '900', lineHeight: 36 },
  titleCompact: { fontSize: 23, lineHeight: 27 },
  message: { color: '#526159', fontSize: 12, lineHeight: 19, marginTop: 6, maxWidth: 430 },
  stats: { backgroundColor: '#E6EEE7', borderBottomColor: '#9CAE9F', borderBottomWidth: 1, borderTopColor: '#9CAE9F', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 22, paddingVertical: 15 },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { color: '#183F35', fontFamily: 'serif', fontSize: 24, fontWeight: '900' },
  statLabel: { color: '#526159', fontSize: 7, fontWeight: '900', letterSpacing: 1, marginTop: 3, textAlign: 'center' },
  statRule: { backgroundColor: '#B7C5BA', width: 1 },
  note: { alignItems: 'baseline', flexDirection: 'row', gap: 10, marginTop: 17 },
  noteNumber: { color: '#A07825', fontFamily: 'serif', fontSize: 18, fontWeight: '900' },
  noteText: { color: '#526159', flex: 1, fontSize: 10, lineHeight: 15 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 21 },
  primaryButton: { alignItems: 'center', backgroundColor: '#183F35', borderColor: '#183F35', borderWidth: 2, flexDirection: 'row', gap: 12, minHeight: 48, paddingHorizontal: 20, shadowColor: '#D3A43B', shadowOffset: { height: 4, width: 4 }, shadowOpacity: 1, shadowRadius: 0 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  secondaryButton: { alignItems: 'center', backgroundColor: '#FFFDF7', borderColor: '#183F35', borderWidth: 2, flexDirection: 'row', gap: 9, minHeight: 48, paddingHorizontal: 18 },
  secondaryButtonText: { color: '#183F35', fontSize: 12, fontWeight: '900' },
  footer: { borderTopColor: '#9CAE9F', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 13 },
  footerText: { color: '#68766F', fontSize: 7, fontWeight: '800', letterSpacing: 1.1 },
  pressed: { opacity: 0.72 },
});