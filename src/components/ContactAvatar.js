import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { getInitials } from '../utils/validation';
import { colors } from '../styles/colors';

export default function ContactAvatar({ contact, size = 54 }) {
  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (contact.avatarUri) {
    return <Image source={{ uri: contact.avatarUri }} style={[styles.avatar, avatarStyle]} />;
  }

  return (
    <View style={[styles.avatar, avatarStyle, { backgroundColor: contact.avatarColor || colors.primary }]}>
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{getInitials(contact.name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
