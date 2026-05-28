import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ItemList } from './src/components/ItemList';
import { VoiceButton } from './src/components/VoiceButton';
import { useItems } from './src/hooks/useItems';
import { useVoiceInput } from './src/hooks/useVoiceInput';
import { parseVoiceText } from './src/utils/parseVoiceText';

export default function App() {
  const { items, addItems, toggleItem, deleteItem, clearDone, clearAll } = useItems();
  const { isListening, error, startListening, stopListening } = useVoiceInput();

  const handleVoiceComplete = useCallback(
    (text) => {
      const parsed = parseVoiceText(text);
      if (parsed.length === 0) {
        return;
      }
      addItems(parsed);
    },
    [addItems],
  );

  const handlePressIn = useCallback(() => {
    startListening(handleVoiceComplete);
  }, [handleVoiceComplete, startListening]);

  const handleClear = useCallback(() => {
    const doneCount = items.filter((item) => item.done).length;

    if (doneCount === 0 && items.length === 0) {
      return;
    }

    Alert.alert('Очистить список', 'Что удалить?', [
      { text: 'Отмена', style: 'cancel' },
      ...(doneCount > 0
        ? [{ text: 'Выполненные', onPress: clearDone }]
        : []),
      {
        text: 'Весь список',
        style: 'destructive',
        onPress: clearAll,
      },
    ]);
  }, [clearAll, clearDone, items]);

  const handleShare = useCallback(async () => {
    if (items.length === 0) {
      return;
    }

    const message = items
      .map((item) => `${item.done ? '✓' : '○'} ${item.text}`)
      .join('\n');

    await Share.share({ message, title: 'SimpleDo' });
  }, [items]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>SimpleDo</Text>
        </View>

        <View style={styles.listContainer}>
          <ItemList items={items} onDelete={deleteItem} onToggle={toggleItem} />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.toolbar}>
          <Pressable
            accessibilityLabel="Очистить список"
            accessibilityRole="button"
            onPress={handleClear}
            style={({ pressed }) => [styles.sideButton, styles.clearButton, pressed && styles.sidePressed]}
          >
            <Text style={styles.sideButtonText}>🗑</Text>
          </Pressable>

          <VoiceButton
            isListening={isListening}
            onPressIn={handlePressIn}
            onPressOut={stopListening}
          />

          <Pressable
            accessibilityLabel="Поделиться списком"
            accessibilityRole="button"
            onPress={handleShare}
            style={({ pressed }) => [styles.sideButton, styles.shareButton, pressed && styles.sidePressed]}
          >
            <Text style={styles.sideButtonText}>↗</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eee',
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  header: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#e8e8e8',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
  },
  listContainer: {
    flex: 1,
  },
  error: {
    color: '#c0392b',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontSize: 14,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#e8e8e8',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
  },
  sideButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  clearButton: {
    backgroundColor: '#d2aa6e',
  },
  shareButton: {
    backgroundColor: '#aa8ef2',
  },
  sidePressed: {
    opacity: 0.85,
  },
  sideButtonText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
  },
});
