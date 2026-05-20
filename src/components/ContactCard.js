import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ContactAvatar from './ContactAvatar';
import { colors } from '../styles/colors';

export default function ContactCard({ contact, onEdit, onDelete }) {
  const hasEmail = Boolean(contact.email?.trim());

  return (
    <View style={styles.card}>
      <ContactAvatar contact={contact} />

      <View style={styles.content}>
        <Text style={styles.name}>{contact.name}</Text>

        <View style={styles.row}>
          <Ionicons name="call-outline" size={16} color={colors.muted} />
          <Text style={styles.meta}>{contact.phone}</Text>
        </View>

        {hasEmail ? (
          <View style={styles.row}>
            <Ionicons name="mail-outline" size={16} color={colors.muted} />
            <Text style={styles.meta}>{contact.email}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Редагувати контакт ${contact.name}`}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          onPress={() => onEdit(contact)}
        >
          <Ionicons name="create-outline" size={21} color={colors.primary} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Видалити контакт ${contact.name}`}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          onPress={() => onDelete(contact)}
        >
          <Ionicons name="trash-outline" size={21} color={colors.danger} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 22,
    elevation: 2,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 14,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 2,
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    marginLeft: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 2,
  },
  iconButton: {
    borderRadius: 14,
    padding: 8,
  },
  pressed: {
    backgroundColor: colors.primaryLight,
  },
});
