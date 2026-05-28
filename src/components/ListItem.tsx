import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { Item } from '../types/item';

type ListItemProps = {
  item: Item;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ListItem({ item, onToggle, onDelete }: ListItemProps) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={item.done ? `${item.text}, выполнено` : item.text}
        onPress={() => onToggle(item.id)}
        style={({ pressed }) => [
          styles.item,
          item.done ? styles.itemDone : styles.itemActive,
          pressed && styles.itemPressed,
        ]}
      >
        <Text style={[styles.text, item.done && styles.textDone]}>{item.text}</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Удалить ${item.text}`}
        hitSlop={8}
        onPress={() => onDelete(item.id)}
        style={({ pressed }) => [styles.deleteButton, pressed && styles.deletePressed]}
      >
        <Text style={styles.deleteText}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  item: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemActive: {
    alignSelf: 'flex-end',
    backgroundColor: '#8ad24e',
    maxWidth: '88%',
  },
  itemDone: {
    alignSelf: 'flex-start',
    backgroundColor: '#ddd',
    maxWidth: '88%',
  },
  itemPressed: {
    opacity: 0.85,
  },
  text: {
    fontSize: 18,
    color: '#1a1a1a',
  },
  textDone: {
    color: '#666',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    marginLeft: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8e8e8',
  },
  deletePressed: {
    backgroundColor: '#d4d4d4',
  },
  deleteText: {
    fontSize: 22,
    lineHeight: 24,
    color: '#666',
  },
});
