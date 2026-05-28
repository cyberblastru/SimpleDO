import { FlatList, StyleSheet, Text, View } from 'react-native';

import type { Item } from '../types/item';
import { ListItem } from './ListItem';

type ItemListProps = {
  items: Item[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ItemList({ items, onToggle, onDelete }: ItemListProps) {
  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Список пуст</Text>
        <Text style={styles.emptyHint}>
          Зажмите кнопку микрофона и скажите, например: «картошка плюс морковка плюс
          сосиски»
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ListItem item={item} onDelete={onDelete} onToggle={onToggle} />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 12,
    paddingBottom: 120,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: '#777',
  },
});
