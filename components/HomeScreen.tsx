import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

type HomeScreenProps = {
  totalQuestions: number;
  questionTime: number;
  onStart: () => void;
};

export default function HomeScreen({
  totalQuestions,
  questionTime,
  onStart,
}: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>Desafio de conhecimentos</Text>
        </View>

        <View style={styles.hero}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>Knowledge</Text>
            <Text style={styles.brandAccent}>Lab</Text>
          </View>

          <Text style={styles.subtitle}>
            Teste seus conhecimentos, construa sequências de acertos
            e veja até onde você consegue chegar.
          </Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoValue}>{totalQuestions}</Text>
            <Text style={styles.infoLabel}>Perguntas</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoValue}>{questionTime}s</Text>
            <Text style={styles.infoLabel}>Por questão</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoValue}>∞</Text>
            <Text style={styles.infoLabel}>Sequência</Text>
          </View>
        </View>

        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>Como funciona</Text>

          <View style={styles.ruleRow}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>1</Text>
            </View>
            <Text style={styles.ruleText}>
              Escolha uma resposta antes que o tempo termine.
            </Text>
          </View>

          <View style={styles.ruleRow}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>2</Text>
            </View>
            <Text style={styles.ruleText}>
              Acertos consecutivos aumentam sua sequência.
            </Text>
          </View>

          <View style={styles.ruleRow}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>3</Text>
            </View>
            <Text style={styles.ruleText}>
              Tente terminar com a maior pontuação possível.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.82}
          style={styles.startButton}
          onPress={onStart}
        >
          <Text style={styles.startButtonText}>Iniciar quiz</Text>
          <Text style={styles.startArrow}>›</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Conhecimento geral • História • Geografia • Ciências
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },

  content: {
    flex: 1,
    width: '100%',
    maxWidth: 820,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF1FA',
    borderWidth: 1,
    borderColor: '#CBD9EA',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 22,
  },

  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#F47C20',
    marginRight: 8,
  },

  badgeText: {
    color: '#214E7A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  hero: {
    marginBottom: 28,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 10,
  },

  brand: {
    color: '#17324D',
    fontSize: 46,
    lineHeight: 49,
    fontWeight: '800',
    letterSpacing: -1.2,
  },

  brandAccent: {
    color: '#F47C20',
    fontSize: 46,
    lineHeight: 49,
    fontWeight: '800',
    letterSpacing: -1.2,
  },

  subtitle: {
    color: '#5B6B7C',
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '500',
    maxWidth: 610,
    marginTop: 16,
  },

  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },

  infoCard: {
    flex: 1,
    minHeight: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9E2EC',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  infoValue: {
    color: '#17324D',
    fontSize: 28,
    fontWeight: '800',
  },

  infoLabel: {
    color: '#66788A',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginTop: 6,
    textAlign: 'center',
  },

  rulesCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9E2EC',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },

  rulesTitle: {
    color: '#17324D',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: 16,
  },

  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  ruleNumber: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#FFF1E6',
    borderWidth: 1,
    borderColor: '#F6B27C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  ruleNumberText: {
    color: '#C85200',
    fontSize: 13,
    fontWeight: '800',
  },

  ruleText: {
    flex: 1,
    color: '#34495E',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },

  startButton: {
    minHeight: 62,
    backgroundColor: '#F47C20',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  startArrow: {
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '500',
    marginLeft: 10,
    marginTop: -2,
  },

  footerText: {
    color: '#748494',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 16,
  },
});