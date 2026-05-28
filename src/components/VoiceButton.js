import { Pressable, StyleSheet, Text } from 'react-native';

export function VoiceButton({ isListening, onPressIn, onPressOut }) {
  return (
    <Pressable
      accessibilityHint="Удерживайте и говорите список через слово плюс"
      accessibilityLabel={isListening ? 'Идёт запись' : 'Голосовой ввод'}
      accessibilityRole="button"
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={({ pressed }) => [
        styles.button,
        isListening ? styles.buttonRecording : styles.buttonIdle,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={styles.icon}>🎤</Text>
      <Text style={styles.label}>{isListening ? 'Слушаю…' : 'Зажать'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 3,
    minHeight: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  buttonIdle: {
    backgroundColor: '#8ad24e',
  },
  buttonRecording: {
    backgroundColor: '#e74c3c',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  icon: {
    fontSize: 24,
    marginBottom: 2,
  },
  label: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
