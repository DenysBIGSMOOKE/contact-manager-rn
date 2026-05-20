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
    minDigits: 10,
    maxDigits: 14,
    groups: [2, 3, 3, 4, 2],
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

export function detectRegionByPhone(phone = '') {
  const digits = digitsOnly(phone);
  const detected = PHONE_REGIONS.find((region) => digits.startsWith(digitsOnly(region.code)));
  return detected ?? PHONE_REGIONS[0];
}

function normalizeDigitsForRegion(value, region) {
  const codeDigits = digitsOnly(region.code);
  let digits = digitsOnly(value);

  if (!digits) {
    return codeDigits;
  }

  if (region.id === 'ua' && digits.startsWith('0')) {
    digits = `${codeDigits}${digits.slice(1)}`;
  }

  if (region.id === 'pl' && digits.length === 9) {
    digits = `${codeDigits}${digits}`;
  }

  if (region.id === 'cz' && digits.length === 9) {
    digits = `${codeDigits}${digits}`;
  }

  if (region.id === 'us' && digits.length === 10) {
    digits = `${codeDigits}${digits}`;
  }

  if (region.id === 'md' && digits.length === 8) {
    digits = `${codeDigits}${digits}`;
  }

  if (region.id === 'de' && digits.startsWith('0')) {
    digits = `${codeDigits}${digits.slice(1)}`;
  }

  if (!digits.startsWith(codeDigits)) {
    digits = `${codeDigits}${digits}`;
  }

  return digits.slice(0, region.maxDigits);
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

export function formatPhoneForRegion(value, regionId = 'ua') {
  const region = getRegionById(regionId);
  const digits = normalizeDigitsForRegion(value, region);
  const chunks = groupDigits(digits, region.groups);

  return chunks.length ? `+${chunks.join(' ')}` : '';
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
