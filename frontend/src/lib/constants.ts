export const SUPPORTED_CURRENCIES = [
  { code: 'XOF', name: 'Franc CFA (BCEAO)', symbol: 'FCFA' },
  { code: 'XAF', name: 'Franc CFA (BEAC)', symbol: 'FCFA' },
  { code: 'USD', name: 'Dollar américain', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'Livre sterling', symbol: '£' },
  { code: 'NGN', name: 'Naira nigérian', symbol: '₦' },
  { code: 'GHS', name: 'Cedi ghanéen', symbol: 'GH₵' },
  { code: 'KES', name: 'Shilling kenyan', symbol: 'KSh' },
  { code: 'MAD', name: 'Dirham marocain', symbol: 'MAD' },
];

export const MOBILE_MONEY_PROVIDERS = [
  { code: 'MTN', name: 'MTN Mobile Money', color: '#FFC107' },
  { code: 'ORANGE', name: 'Orange Money', color: '#FF6600' },
  { code: 'MOOV', name: 'Moov Money', color: '#007DC5' },
  { code: 'WAVE', name: 'Wave', color: '#1DC8C8' },
];

export const BILL_TYPES = [
  { code: 'ELECTRICITY', name: 'Électricité', icon: '⚡' },
  { code: 'WATER', name: 'Eau', icon: '💧' },
  { code: 'INTERNET', name: 'Internet', icon: '🌐' },
  { code: 'TV', name: 'Télévision', icon: '📺' },
  { code: 'PHONE', name: 'Téléphonie', icon: '📱' },
  { code: 'OTHER', name: 'Autre', icon: '📄' },
];

export const KYC_LEVELS = [
  { level: 'NONE', label: 'Non vérifié', description: 'Compte non vérifié', limit: '0' },
  { level: 'LEVEL_1', label: 'Niveau 1', description: 'Téléphone vérifié', limit: '100 000 XOF/jour' },
  { level: 'LEVEL_2', label: 'Niveau 2', description: 'Identité vérifiée', limit: '1 000 000 XOF/jour' },
  { level: 'LEVEL_3', label: 'Niveau 3', description: 'Adresse vérifiée', limit: 'Illimité' },
];

export const TRANSACTION_TYPES = [
  { code: 'DEPOSIT', label: 'Dépôt' },
  { code: 'WITHDRAWAL', label: 'Retrait' },
  { code: 'TRANSFER_IN', label: 'Reçu' },
  { code: 'TRANSFER_OUT', label: 'Envoyé' },
  { code: 'PAYMENT', label: 'Paiement' },
  { code: 'REFUND', label: 'Remboursement' },
  { code: 'CURRENCY_CONVERSION', label: 'Conversion' },
];

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Neero';
