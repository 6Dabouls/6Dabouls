export enum UserRole {
  USER = 'user',
  PROMOTER = 'promoter',
  ADMIN = 'admin',
}

export enum KycStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ProjectStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  ACTIVE = 'active',
  FUNDED = 'funded',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum EnergyType {
  SOLAR = 'solar',
  WIND = 'wind',
  HYDRO = 'hydro',
  BIOMASS = 'biomass',
  GEOTHERMAL = 'geothermal',
  OTHER = 'other',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum InvestmentStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  ORANGE_MONEY = 'orange_money',
  MTN_MOBILE_MONEY = 'mtn_mobile_money',
  PAYPAL = 'paypal',
  WALLET = 'wallet',
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  INVESTMENT = 'investment',
  RETURN = 'return',
  COMMISSION = 'commission',
  REFUND = 'refund',
}

export enum NotificationType {
  INVESTMENT_CONFIRMED = 'investment_confirmed',
  PAYMENT_RECEIVED = 'payment_received',
  NEW_PROJECT = 'new_project',
  FUNDING_GOAL_REACHED = 'funding_goal_reached',
  PROJECT_DELAYED = 'project_delayed',
  PROJECT_UPDATE = 'project_update',
  KYC_APPROVED = 'kyc_approved',
  KYC_REJECTED = 'kyc_rejected',
  RETURN_DISTRIBUTED = 'return_distributed',
  WITHDRAWAL_PROCESSED = 'withdrawal_processed',
}

export enum DocumentType {
  NATIONAL_ID = 'national_id',
  PASSPORT = 'passport',
  DRIVING_LICENSE = 'driving_license',
  UTILITY_BILL = 'utility_bill',
  BANK_STATEMENT = 'bank_statement',
}
