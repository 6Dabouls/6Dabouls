export type UserRole = 'USER' | 'ADMIN' | 'COMPLIANCE' | 'FINANCE' | 'SUPPORT';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'CLOSED';
export type KYCLevel = 'NONE' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3';
export type WalletStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'PAYMENT' | 'REFUND' | 'FEE' | 'CURRENCY_CONVERSION';
export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REVERSED';
export type CardType = 'VIRTUAL' | 'PHYSICAL';
export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'EXPIRED' | 'CANCELLED' | 'PENDING_ACTIVATION';

export interface Profile {
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  profilePicture: string | null;
}

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  kycLevel: KYCLevel;
  twoFAEnabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  profile: Profile | null;
}

export interface Wallet {
  id: string;
  currency: string;
  balance: string;
  frozenBalance: string;
  status: WalletStatus;
  dailyLimit: string;
  monthlyLimit: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  reference: string;
  amount: string;
  fee: string;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  description: string | null;
  externalRef: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  fromUser?: { id: string; profile: { firstName: string | null; lastName: string | null } | null } | null;
  toUser?: { id: string; profile: { firstName: string | null; lastName: string | null } | null } | null;
}

export interface Card {
  id: string;
  type: CardType;
  maskedNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cardholderName: string;
  status: CardStatus;
  dailyLimit: string;
  currency: string;
  trackingNumber: string | null;
  activatedAt: string | null;
  createdAt: string;
  cardNumber?: string;
  cvv?: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface KYCDocument {
  id: string;
  type: string;
  fileUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason: string | null;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
  _count?: { messages: number };
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderRole: UserRole;
  message: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: { message: string; code?: string };
  pagination?: Pagination;
  transactions?: T[];
  notifications?: T[];
  tickets?: T[];
  users?: T[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  timestamp: string;
}
