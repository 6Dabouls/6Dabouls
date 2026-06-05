import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.JWT_ACCESS_SECRET || 'fallback-encryption-key-32chars!!';
const ALGORITHM = 'aes-256-gcm';

function getKey(): Buffer {
  return crypto.scryptSync(ENCRYPTION_KEY, 'neero-card-salt', 32);
}

export function encryptCardNumber(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptCardNumber(encryptedData: string): string {
  const key = getKey();
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error('Invalid encrypted data format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export function maskCardNumber(cardNumber: string): string {
  const clean = cardNumber.replace(/\s/g, '');
  if (clean.length < 4) return '*'.repeat(clean.length);
  const lastFour = clean.slice(-4);
  const masked = '*'.repeat(clean.length - 4);
  return (masked + lastFour).replace(/(.{4})/g, '$1 ').trim();
}

export function generateCardNumber(): string {
  // Generate a valid-format 16-digit card number using Luhn algorithm
  const prefix = '4'; // Visa-like prefix
  let number = prefix;

  // Generate 14 random digits
  for (let i = 0; i < 14; i++) {
    number += Math.floor(Math.random() * 10).toString();
  }

  // Calculate Luhn check digit
  const checkDigit = luhnCheckDigit(number);
  return number + checkDigit;
}

function luhnCheckDigit(partialNumber: string): string {
  let sum = 0;
  let alternate = false;

  for (let i = partialNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(partialNumber[i], 10);
    if (alternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    alternate = !alternate;
  }

  const remainder = sum % 10;
  return remainder === 0 ? '0' : (10 - remainder).toString();
}

export function generateCVV(): string {
  return Math.floor(100 + Math.random() * 900).toString();
}

export function generateTrackingNumber(): string {
  const prefix = 'NRO';
  const random = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `${prefix}${random}`;
}
