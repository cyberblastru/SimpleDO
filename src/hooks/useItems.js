import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { createId } from '../utils/id';

const STORAGE_KEY = 'simpledo-items';

export function useItems() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled || !raw) {
          return;
        }

        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) {
          setLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items, loaded]);

  const addItems = useCallback((texts) => {
    if (texts.length === 0) {
      return;
    }

    const now = Date.now();
    const newItems = texts.map((text, index) => ({
      id: createId(),
      text,
      done: false,
      createdAt: now + index,
    }));

    setItems((current) => [...current, ...newItems]);
  }, []);

  const toggleItem = useCallback((id) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  }, []);

  const deleteItem = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearDone = useCallback(() => {
    setItems((current) => current.filter((item) => !item.done));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    loaded,
    addItems,
    toggleItem,
    deleteItem,
    clearDone,
    clearAll,
  };
}
