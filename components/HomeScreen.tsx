import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

type HistoryQuestionMeta = { category?: 'Brasil' | 'Mundo' };
const questionBank = questions as unknown as HistoryQuestionMeta[];
const brazilTotal = questionBank.filter((item) => item.category === 'Brasil').length;
const worldTotal = questionBank.length - brazilTotal;

const periods = [
  ['Antiguidade', 'Civilizações e ideias'],
  ['Brasil', 'Colônia, Império e República'],
  ['Mundo moderno', 'Revoluções e transformações'],
  ['Século XX', 'Conflitos e novos caminhos'],
];

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const desktop = width >= 900;
  const compact = height < 700;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.page, compact && styles.pageCompact]}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.mark}><Text style={styles.markText}>H</Text></View>
            <View>
              <Text style={styles.brandName}>HISTÓRIA EM JOGO</Text>
              <Text style={styles.brandCaption}>BRASIL E MUNDO</Text>
            </View>
          </View>
          <Text style={styles.headerNote}>{questionBank.length} QUESTÕES</Text>
        </View>

        <View style={[styles.main, desktop && styles.mainDesktop]}>
          <View style={[styles.hero, desktop && styles.heroDesktop]}>
            <View style={styles.sectionLabelRow}>
              <View style={styles.labelLine} />
              <Text style={styles.sectionLabel}>QUIZ EDUCACIONAL</Text>
            </View>
            <Text style={[styles.title, !desktop && styles.titleMobile]}>
              A história não está parada no passado.
            </Text>
            <Text style={styles.description}>
              Explore acontecimentos do Brasil e do mundo, responda com atenção
              e entenda o contexto de cada resposta.
            </Text>

            <View style={styles.numbers}>
              <View>
                <Text style={styles.number}>{brazilTotal}</Text>
                <Text style={styles.numberLabel}>BRASIL</Text>
              </View>
              <View style={styles.numberDivider} />
              <View>
                <Text style={styles.number}>{worldTotal}</Text>
                <Text style={styles.numberLabel}>MUNDO</Text>
              </View>
              <View style={styles.numberDivider} />
              <View>
                <Text style={styles.number}>20s</Text>
                <Text style={styles.numberLabel}>TEMPO</Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/quiz')}
              style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}
            >
              <Text style={styles.startButtonText}>Começar</Text>
              <Ionicons color="#FFFFFF" name="arrow-forward" size={19} />
            </Pressable>
          </View>

          {desktop ? (
            <View style={styles.timelinePanel}>
              <Text style={styles.timelineTitle}>Percurso da partida</Text>
              <View style={styles.timelineRule} />
              {periods.map(([period, description], index) => (
                <View key={period} style={styles.periodRow}>
                  <Text style={styles.periodNumber}>0{index + 1}</Text>
                  <View style={styles.periodCopy}>
                    <Text style={styles.periodName}>{period}</Text>
                    <Text style={styles.periodDescription}>{description}</Text>
                  </View>
                </View>
              ))}
              <Text style={styles.panelFootnote}>
                Perguntas embaralhadas e explicações após cada resposta.
              </Text>
            </View>
          ) : (
            <View style={styles.mobileNote}>
              <Ionicons color="#226149" name="time-outline" size={18} />
              <Text style={styles.mobileNoteText}>Uma jornada rápida, sem rolagem.</Text>
            </View>
          )}
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
  page: { flex: 1, marginHorizontal: 'auto', maxWidth: 1280, padding: 30, width: '100%' },
  pageCompact: { paddingVertical: 18 },
  header: { alignItems: 'center', borderBottomColor: '#9CAE9F', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 15 },
  brand: { alignItems: 'center', flexDirection: 'row', gap: 11 },
  mark: { alignItems: 'center', backgroundColor: '#183F35', borderColor: '#183F35', borderWidth: 2, height: 42, justifyContent: 'center', width: 42 },
  markText: { color: '#FFFFFF', fontFamily: 'serif', fontSize: 23, fontWeight: '900' },
  brandName: { color: '#17231F', fontSize: 14, fontWeight: '900', letterSpacing: 1.2 },
  brandCaption: { color: '#A07825', fontSize: 8, fontWeight: '800', letterSpacing: 1.8, marginTop: 2 },
  headerNote: { color: '#526159', fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  main: { flex: 1, justifyContent: 'center' },
  mainDesktop: { alignItems: 'center', flexDirection: 'row', gap: 80, justifyContent: 'space-between' },
  hero: { maxWidth: 650 },
  heroDesktop: { flex: 1 },
  sectionLabelRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  labelLine: { backgroundColor: '#D3A43B', height: 3, width: 28 },
  sectionLabel: { color: '#226149', fontSize: 9, fontWeight: '900', letterSpacing: 1.7 },
  title: { color: '#17231F', fontFamily: 'serif', fontSize: 55, fontWeight: '800', letterSpacing: -1.3, lineHeight: 60, marginTop: 15 },
  titleMobile: { fontSize: 38, lineHeight: 43 },
  description: { color: '#526159', fontSize: 16, lineHeight: 25, marginTop: 16, maxWidth: 560 },
  numbers: { alignItems: 'center', flexDirection: 'row', marginTop: 23 },
  number: { color: '#183F35', fontSize: 21, fontWeight: '900' },
  numberLabel: { color: '#68766F', fontSize: 8, fontWeight: '800', letterSpacing: 1, marginTop: 2 },
  numberDivider: { backgroundColor: '#D3A43B', height: 34, marginHorizontal: 20, width: 2 },
  startButton: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#183F35', borderColor: '#183F35', borderWidth: 2, flexDirection: 'row', gap: 18, marginTop: 25, minHeight: 50, paddingHorizontal: 22, shadowColor: '#D3A43B', shadowOffset: { height: 4, width: 4 }, shadowOpacity: 1, shadowRadius: 0 },
  startButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  pressed: { opacity: 0.76 },
  timelinePanel: { backgroundColor: '#E6EEE7', borderLeftColor: '#D3A43B', borderLeftWidth: 5, maxWidth: 390, padding: 24, paddingLeft: 28, width: '36%' },
  timelineTitle: { color: '#183F35', fontFamily: 'serif', fontSize: 24, fontWeight: '800' },
  timelineRule: { backgroundColor: '#183F35', height: 2, marginBottom: 10, marginTop: 11 },
  periodRow: { alignItems: 'center', borderBottomColor: '#B7C5BA', borderBottomWidth: 1, flexDirection: 'row', paddingVertical: 11 },
  periodNumber: { color: '#A07825', fontFamily: 'serif', fontSize: 18, fontWeight: '800', width: 40 },
  periodCopy: { flex: 1 },
  periodName: { color: '#183F35', fontSize: 13, fontWeight: '800' },
  periodDescription: { color: '#5B6B63', fontSize: 10, marginTop: 2 },
  panelFootnote: { color: '#526159', fontSize: 10, lineHeight: 15, marginTop: 13 },
  mobileNote: { alignItems: 'center', borderTopColor: '#9CAE9F', borderTopWidth: 1, flexDirection: 'row', gap: 8, marginTop: 22, paddingTop: 13 },
  mobileNoteText: { color: '#526159', fontSize: 11, fontWeight: '600' },
  footer: { borderTopColor: '#9CAE9F', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 13 },
  footerText: { color: '#68766F', fontSize: 7, fontWeight: '800', letterSpacing: 1.1 },
});
