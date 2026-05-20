import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ContactCard from '../components/ContactCard';
import { useContacts } from '../context/ContactsContext';
import { colors } from '../styles/colors';

export default function HomeScreen({ navigation }) {
  const { contacts, deleteContact, isLoaded } = useContacts();
  const [search, setSearch] = useState('');

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = contacts
      .filter((contact) => {
        if (!query) return true;

        return [contact.name, contact.phone, contact.email]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [contacts, search]);

  function handleDelete(contact) {
    Alert.alert(
      'Видалити контакт?',
      `${contact.name} буде видалено зі списку.`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: () => deleteContact(contact.id),
        },
      ]
    );
  }

  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Завантаження контактів...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <View>
          <Text style={styles.title}>Контакти</Text>
          <Text style={styles.subtitle}>Усього: {contacts.length}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Додати новий контакт"
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          onPress={() => navigation.navigate('ContactForm')}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color={colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Пошук за іменем, телефоном або email"
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={colors.muted} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContactCard
            contact={item}
            onEdit={(contact) => navigation.navigate('ContactForm', { contact })}
            onDelete={handleDelete}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={52} color={colors.muted} />
            <Text style={styles.emptyTitle}>Контакти не знайдено</Text>
            <Text style={styles.emptyText}>Спробуйте змінити запит або додайте новий контакт.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 18,
  },
  center: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.muted,
    marginTop: 12,
  },
  hero: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingTop: 20,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 4,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  addButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
  list: {
    paddingBottom: 22,
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 72,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 14,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
