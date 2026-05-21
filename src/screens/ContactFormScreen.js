import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import ContactAvatar from '../components/ContactAvatar';
import { useContacts } from '../context/ContactsContext';
import { colors } from '../styles/colors';
import { validateContact } from '../utils/validation';
import {
  PHONE_REGIONS,
  detectRegionByPhone,
  formatPhoneForRegion,
  getPhonePrefix,
  getRegionById,
  normalizePhoneForSave,
} from '../utils/phoneUtils';

export default function ContactFormScreen({ navigation, route }) {
  const contact = route.params?.contact;
  const isEditing = Boolean(contact);
  const { contacts, addContact, updateContact } = useContacts();
  const initialRegion = contact?.region ?? detectRegionByPhone(contact?.phone).id;

  const [values, setValues] = useState({
    id: contact?.id,
    name: contact?.name ?? '',
    region: initialRegion,
    phone: contact?.phone ? formatPhoneForRegion(contact.phone, initialRegion, { keepPrefix: true }) : getPhonePrefix(initialRegion),
    email: contact?.email ?? '',
    avatarUri: contact?.avatarUri ?? '',
    avatarColor: contact?.avatarColor ?? '#2563EB',
  });
  const [errors, setErrors] = useState({});
  const scrollViewRef = useRef(null);

  const previewContact = useMemo(
    () => ({
      name: values.name || 'Новий контакт',
      avatarUri: values.avatarUri,
      avatarColor: values.avatarColor,
    }),
    [values]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleSave} style={styles.headerSave}>
          <Text style={styles.headerSaveText}>Зберегти</Text>
        </Pressable>
      ),
    });
  });

  function updateField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function updatePhone(value) {
    const formattedPhone = formatPhoneForRegion(value, values.region, { keepPrefix: true });

    setValues((prev) => ({ ...prev, phone: formattedPhone }));
    setErrors((prev) => ({ ...prev, phone: undefined }));
  }

  function changeRegion(regionId) {
    setValues((prev) => ({
      ...prev,
      region: regionId,
      phone: getPhonePrefix(regionId),
    }));
    setErrors((prev) => ({ ...prev, phone: undefined }));
  }

  function scrollToInput(yPosition) {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: yPosition,
        animated: true,
      });
    }, 250);
  }

  async function pickAvatar() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Немає доступу', 'Дозвольте доступ до галереї, щоб вибрати аватар.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.75,
    });

    if (!result.canceled && result.assets?.length) {
      updateField('avatarUri', result.assets[0].uri);
    }
  }

  function handleSave() {
    const validationErrors = validateContact(values, contacts);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const contactToSave = {
      ...values,
      name: values.name.trim(),
      phone: normalizePhoneForSave(values.phone, values.region),
      email: values.email.trim(),
    };

    if (isEditing) {
      updateContact(contactToSave);
    } else {
      addContact(contactToSave);
    }

    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.screen}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          {values.avatarUri ? (
            <Image source={{ uri: values.avatarUri }} style={styles.largeAvatar} />
          ) : (
            <ContactAvatar contact={previewContact} size={110} />
          )}

          <Pressable style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]} onPress={pickAvatar}>
            <Ionicons name="image-outline" size={18} color={colors.primary} />
            <Text style={styles.avatarButtonText}>Обрати аватар</Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <LabeledInput
            label="Ім'я"
            placeholder="Наприклад, Іван Петренко"
            value={values.name}
            error={errors.name}
            icon="person-outline"
            onChangeText={(text) => updateField('name', text)}
          />

          <RegionSelector selectedRegion={values.region} onChange={changeRegion} />

          <LabeledInput
            label="Телефон"
            placeholder={getRegionById(values.region).placeholder}
            value={values.phone}
            error={errors.phone}
            helperText="Код країни додається автоматично. Вводьте тільки решту номера після коду."
            icon="call-outline"
            keyboardType="phone-pad"
            onFocus={() => scrollToInput(360)}
            onChangeText={updatePhone}
          />

          <LabeledInput
            label="Email (необов'язково)"
            placeholder="name@example.com"
            value={values.email}
            error={errors.email}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => scrollToInput(460)}
            onChangeText={(text) => updateField('email', text)}
          />

          <Pressable style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]} onPress={handleSave}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>{isEditing ? 'Оновити контакт' : 'Додати контакт'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function RegionSelector({ selectedRegion, onChange }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Країна / регіон номера</Text>

      <View style={styles.regionGrid}>
        {PHONE_REGIONS.map((region) => {
          const isSelected = selectedRegion === region.id;

          return (
            <Pressable
              key={region.id}
              accessibilityRole="button"
              accessibilityLabel={`Обрати регіон ${region.name}`}
              style={({ pressed }) => [
                styles.regionChip,
                isSelected && styles.regionChipSelected,
                pressed && styles.pressed,
              ]}
              onPress={() => onChange(region.id)}
            >
              <Text style={[styles.regionText, isSelected && styles.regionTextSelected]}>
                {region.flag} {region.shortName} {region.code}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function LabeledInput({ label, icon, error, helperText, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputWrap, error && styles.inputError]}>
        <Ionicons name={icon} size={20} color={colors.muted} />
        <TextInput
          {...inputProps}
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!error && helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 180,
  },
  headerSave: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  headerSaveText: {
    color: colors.primary,
    fontWeight: '800',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 22,
  },
  largeAvatar: {
    borderRadius: 55,
    height: 110,
    width: 110,
  },
  avatarButton: {
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 18,
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatarButtonText: {
    color: colors.primary,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.75,
  },
  form: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  regionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  regionChip: {
    backgroundColor: colors.input,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  regionChipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  regionText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  regionTextSelected: {
    color: colors.primary,
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: colors.input,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: colors.danger,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 13,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 6,
  },
  helperText: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 6,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 15,
  },
  saveButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
