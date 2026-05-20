import { getRegionById, isPhoneValidForRegion } from './phoneUtils';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(values) {
  const errors = {};
  const name = (values.name ?? '').trim();
  const phone = (values.phone ?? '').trim();
  const email = (values.email ?? '').trim();
  const region = getRegionById(values.region ?? 'ua');

  if (name.length < 2) {
    errors.name = "Ім'я має містити щонайменше 2 символи.";
  }

  if (!isPhoneValidForRegion(phone, region.id)) {
    errors.phone = `Введіть коректний номер для регіону ${region.name}. Приклад: ${region.placeholder}.`;
  }

  if (email.length > 0 && !emailPattern.test(email)) {
    errors.email = 'Email введено некоректно. Можна залишити поле порожнім.';
  }

  return errors;
}

export function getInitials(name) {
  return String(name ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
