export const SUPPORTED_CURRENCIES = ['XOF', 'XAF', 'USD', 'EUR', 'GBP', 'NGN', 'GHS', 'KES', 'MAD'];

export function isValidPhone(phone: string): boolean {
  // International format: +[country code][number], 7-15 digits total after +
  const phoneRegex = /^\+[1-9]\d{6,14}$/;
  return phoneRegex.test(phone);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidCurrency(currency: string): boolean {
  return SUPPORTED_CURRENCIES.includes(currency.toUpperCase());
}

export function isValidAmount(amount: number): boolean {
  return typeof amount === 'number' && amount > 0 && isFinite(amount) && amount <= 99999999;
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        (sanitized as Record<string, unknown>)[key] = sanitizeInput(value);
      } else {
        (sanitized as Record<string, unknown>)[key] = value;
      }
    }
  }
  return sanitized;
}

export function isStrongPassword(password: string): boolean {
  // At least 8 chars, one uppercase, one lowercase, one digit, one special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{}|;:',./`~])[A-Za-z\d@$!%*?&#^()_+\-=[\]{}|;:',./`~]{8,}$/;
  return passwordRegex.test(password);
}

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}
