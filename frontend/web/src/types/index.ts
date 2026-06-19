export type UserRole = 'user' | 'promoter' | 'admin'
export type KycStatus = 'pending' | 'under_review' | 'approved' | 'rejected'
export type ProjectStatus = 'draft' | 'pending_review' | 'active' | 'funded' | 'in_progress' | 'completed' | 'cancelled'
export type EnergyType = 'solar' | 'wind' | 'hydro' | 'biomass' | 'geothermal' | 'other'
export type RiskLevel = 'low' | 'medium' | 'high'
export type InvestmentStatus = 'pending' | 'active' | 'completed' | 'cancelled'
export type PaymentMethod = 'card' | 'bank_transfer' | 'orange_money' | 'mtn_mobile_money' | 'paypal' | 'wallet'
export type TransactionType = 'deposit' | 'withdrawal' | 'investment' | 'return' | 'commission' | 'refund'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  country?: string
  city?: string
  profilePicture?: string
  role: UserRole
  kycStatus: KycStatus
  emailVerified: boolean
  phoneVerified: boolean
  twoFactorEnabled: boolean
  walletBalance: number
  preferredCurrency?: string
  isActive: boolean
  createdAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  country: string
  region: string
  city: string
  promoter: User
  energyType: EnergyType
  status: ProjectStatus
  riskLevel: RiskLevel
  totalBudget: number
  targetAmount: number
  raisedAmount: number
  expectedReturn: number
  durationMonths: number
  startDate: string
  endDate: string
  fundingProgress: number
  minimumInvestment: number
  maximumInvestment?: number
  currency: string
  images?: string[]
  videos?: string[]
  documents?: { name: string; url: string; type: string }[]
  investorCount: number
  isFeatured?: boolean
  createdAt: string
}

export interface Investment {
  id: string
  userId: string
  projectId: string
  project: Project
  amount: number
  currency: string
  status: InvestmentStatus
  ownershipPercentage: number
  totalReturnsReceived: number
  expectedAnnualReturn: number
  maturityDate: string
  isRecurring: boolean
  recurringFrequency?: string
  createdAt: string
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  currency: string
  status: string
  paymentMethod?: PaymentMethod
  description?: string
  createdAt: string
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface PortfolioSummary {
  totalInvested: number
  totalReturns: number
  netValue: number
  activeInvestments: number
  totalInvestments: number
  averageAnnualReturn: number
  byEnergyType: Record<string, number>
  investments: Investment[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}
