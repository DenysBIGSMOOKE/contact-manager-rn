export const PHONE_REGIONS = [
  {
    id: 'ua',
    name: 'Україна',
    shortName: 'UA',
    flag: '🇺🇦',
    code: '+380',
    minDigits: 12,
    maxDigits: 12,
    groups: [3, 2, 3, 2, 2],
    placeholder: '+380 67 123 45 67',
  },
  {
    id: 'pl',
    name: 'Польща',
    shortName: 'PL',
    flag: '🇵🇱',
    code: '+48',
    minDigits: 11,
    maxDigits: 11,
    groups: [2, 3, 3, 3],
    placeholder: '+48 123 456 789',
  },
  {
    id: 'de',
    name: 'Німеччина',
    shortName: 'DE',
    flag: '🇩🇪',
    code: '+49',
    // Для навчального проєкту фіксуємо німецький номер у форматі з прикладу:
    // +49 151 234 5678. Це не дає вводити занадто довгий номер.
    minDigits: 12,
    maxDigits: 12,
    groups: [2, 3, 3, 4],
    placeholder: '+49 151 234 5678',
  },
  {
    id: 'cz',
    name: 'Чехія',
    shortName: 'CZ',
    flag: '🇨🇿',
    code: '+420',
    minDigits: 12,
    maxDigits: 12,
    groups: [3, 3, 3, 3],
    placeholder: '+420 777 123 456',
  },
  {
    id: 'us',
    name: 'США',
    shortName: 'US',
    flag: '🇺🇸',
    code: '+1',
    minDigits: 11,
    maxDigits: 11,
    groups: [1, 3, 3, 4],
    placeholder: '+1 212 555 1234',
  },
  {
    id: 'md',
    name: 'Молдова',
    shortName: 'MD',
    flag: '🇲🇩',
    code: '+373',
    minDigits: 11,
    maxDigits: 11,
    groups: [3, 2, 3, 3],
    placeholder: '+373 67 123 456',
  },
];

export function getRegionById(regionId) {
  return PHONE_REGIONS.find((region) => region.id === regionId) ?? PHONE_REGIONS[0];
}

export function digitsOnly(value = '') {
  return String(value).replace(/\D/g, '');
}

export function getPhoneDigitsForComparison(phone = '') {
  return digitsOnly(phone);
}

export function detectRegionByPhone(phone = '') {
  const digits = digitsOnly(phone);
  const detected = PHONE_REGIONS.find((region) => digits.startsWith(digitsOnly(region.code)));

  return detected ?? PHONE_REGIONS[0];
}

function getNationalDigitsLimit(region) {
  const codeLength = digitsOnly(region.code).length;

  return Math.max(region.maxDigits - codeLength, 0);
}

export function getPhonePrefix(regionId = 'ua') {
  const region = getRegionById(regionId);

  return `${region.code} `;
}

function stripSelectedRegionCodeOnce(value, region) {
  const text = String(value ?? '').trimStart();
  const codeDigits = digitsOnly(region.code);
  let digits = digitsOnly(text);

  if (!digits) {
    return '';
  }

  // Якщо поле вже містить автододаний код країни, прибираємо тільки цей перший код.
  // Важливо: не видаляємо повторно такі ж цифри з локального номера.
  // Наприклад, для US +1 номер може починатися з 1, а для CZ +420 — з 420.
  if (text.startsWith(region.code) || text.startsWith(codeDigits) || text.startsWith(`00${codeDigits}`)) {
    if (text.startsWith(`00${codeDigits}`)) {
      digits = digits.slice(codeDigits.length + 2);
    } else {
      digits = digits.slice(codeDigits.length);
    }
  }

  return digits;
}

export function getNationalDigitsForRegion(value = '', regionId = 'ua') {
  const region = getRegionById(regionId);
  let digits = stripSelectedRegionCodeOnce(value, region);

  // Дозволяємо вводити локальні номери з початковим 0 для країн, де так часто пишуть.
  if ((region.id === 'ua' || region.id === 'de') && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  return digits.slice(0, getNationalDigitsLimit(region));
}

function groupDigits(digits, groups) {
  const chunks = [];
  let index = 0;

  groups.forEach((groupSize) => {
    if (index >= digits.length) return;

    const nextChunk = digits.slice(index, index + groupSize);
    if (nextChunk) chunks.push(nextChunk);
    index += groupSize;
  });

  if (index < digits.length) {
    chunks.push(digits.slice(index));
  }

  return chunks;
}

export function formatPhoneForRegion(value = '', regionId = 'ua', options = {}) {
  const { keepPrefix = false } = options;
  const region = getRegionById(regionId);
  const codeDigits = digitsOnly(region.code);
  const nationalDigits = getNationalDigitsForRegion(value, region.id);

  if (!nationalDigits) {
    return keepPrefix ? getPhonePrefix(region.id) : '';
  }

  const fullDigits = `${codeDigits}${nationalDigits}`.slice(0, region.maxDigits);
  const chunks = groupDigits(fullDigits, region.groups);

  return chunks.length ? `+${chunks.join(' ')}` : getPhonePrefix(region.id);
}

export function normalizePhoneForSave(value = '', regionId = 'ua') {
  return formatPhoneForRegion(value, regionId, { keepPrefix: false }).trim();
}

export function isPhoneValidForRegion(phone, regionId = 'ua') {
  const region = getRegionById(regionId);
  const digits = digitsOnly(phone);
  const codeDigits = digitsOnly(region.code);

  return (
    digits.startsWith(codeDigits) &&
    digits.length >= region.minDigits &&
    digits.length <= region.maxDigits
  );
}
