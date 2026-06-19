import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from './store'

import Layout from './components/layout/Layout'
import AuthLayout from './components/layout/AuthLayout'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import TwoFactorPage from './pages/auth/TwoFactorPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

import DashboardPage from './pages/dashboard/DashboardPage'
import ProjectsPage from './pages/projects/ProjectsPage'
import ProjectDetailPage from './pages/projects/ProjectDetailPage'
import PortfolioPage from './pages/portfolio/PortfolioPage'
import PaymentsPage from './pages/payments/PaymentsPage'
import KycPage from './pages/kyc/KycPage'
import ProfilePage from './pages/ProfilePage'
import NotificationsPage from './pages/NotificationsPage'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminProjects from './pages/admin/AdminProjects'
import AdminKyc from './pages/admin/AdminKyc'
import AdminWithdrawals from './pages/admin/AdminWithdrawals'

import PromoterDashboard from './pages/promoter/PromoterDashboard'
import PromoterProjects from './pages/promoter/PromoterProjects'
import PromoterSubmitProject from './pages/promoter/PromoterSubmitProject'

function PrivateRoute({ children, roles }: { children: JSX.Element; roles?: string[] }) {
  const { user } = useSelector((s: RootState) => s.auth)
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/2fa" element={<TwoFactorPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/kyc" element={<KycPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      <Route element={<PrivateRoute roles={['admin']}><Layout /></PrivateRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/kyc" element={<AdminKyc />} />
        <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
      </Route>

      <Route element={<PrivateRoute roles={['promoter', 'admin']}><Layout /></PrivateRoute>}>
        <Route path="/promoter" element={<PromoterDashboard />} />
        <Route path="/promoter/projects" element={<PromoterProjects />} />
        <Route path="/promoter/projects/new" element={<PromoterSubmitProject />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
