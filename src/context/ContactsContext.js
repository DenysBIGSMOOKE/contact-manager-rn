import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultContacts } from '../data/defaultContacts';

const STORAGE_KEY = '@contacts_manager_contacts_v1';
const ContactsContext = createContext(null);

export function ContactsProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadContacts() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        setContacts(raw ? JSON.parse(raw) : defaultContacts);
      } catch (error) {
        console.warn('Не вдалося завантажити контакти:', error);
        setContacts(defaultContacts);
      } finally {
        setIsLoaded(true);
      }
    }

    loadContacts();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contacts)).catch((error) => {
      console.warn('Не вдалося зберегти контакти:', error);
    });
  }, [contacts, isLoaded]);

  const value = useMemo(() => {
    function addContact(contact) {
      setContacts((prev) => [
        {
          ...contact,
          id: Date.now().toString(),
          avatarColor: contact.avatarColor || randomAvatarColor(),
        },
        ...prev,
      ]);
    }

    function updateContact(updatedContact) {
      setContacts((prev) =>
        prev.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact))
      );
    }

    function deleteContact(id) {
      setContacts((prev) => prev.filter((contact) => contact.id !== id));
    }

    return {
      contacts,
      isLoaded,
      addContact,
      updateContact,
      deleteContact,
    };
  }, [contacts, isLoaded]);

  return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>;
}

export function useContacts() {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error('useContacts має використовуватися всередині ContactsProvider');
  }

  return context;
}

function randomAvatarColor() {
  const palette = ['#2563EB', '#16A34A', '#F59E0B', '#7C3AED', '#DB2777', '#0891B2'];
  return palette[Math.floor(Math.random() * palette.length)];
}
