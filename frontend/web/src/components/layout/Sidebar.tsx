import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import {
  LayoutDashboard, FolderOpen, Briefcase, CreditCard,
  Shield, User, Bell, Users, CheckSquare, Building2, Leaf
} from 'lucide-react'

const userNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/projects', icon: FolderOpen, label: 'Projets' },
  { to: '/portfolio', icon: Briefcase, label: 'Portefeuille' },
  { to: '/payments', icon: CreditCard, label: 'Paiements' },
  { to: '/kyc', icon: Shield, label: 'Vérification KYC' },
  { to: '/profile', icon: User, label: 'Profil' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
]

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard Admin' },
  { to: '/admin/users', icon: Users, label: 'Utilisateurs' },
  { to: '/admin/projects', icon: FolderOpen, label: 'Projets' },
  { to: '/admin/kyc', icon: CheckSquare, label: 'KYC' },
  { to: '/admin/withdrawals', icon: CreditCard, label: 'Retraits' },
]

const promoterNav = [
  { to: '/promoter', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/promoter/projects', icon: Building2, label: 'Mes projets' },
  { to: '/promoter/projects/new', icon: FolderOpen, label: 'Nouveau projet' },
  { to: '/projects', icon: FolderOpen, label: 'Catalogue' },
]

export default function Sidebar() {
  const { user } = useSelector((s: RootState) => s.auth)

  const nav = user?.role === 'admin' ? adminNav
    : user?.role === 'promoter' ? promoterNav
    : userNav

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900">GreenInvest</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin' || to === '/promoter' || to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-400 text-center">© 2025 GreenInvest</div>
      </div>
    </aside>
  )
}
