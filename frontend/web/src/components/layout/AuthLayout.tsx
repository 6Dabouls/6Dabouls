import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Leaf } from 'lucide-react'

export default function AuthLayout() {
  const { user } = useSelector((s: RootState) => s.auth)
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-full">
            <Leaf size={20} />
            <span className="font-bold text-lg">GreenInvest</span>
          </div>
          <p className="mt-2 text-gray-500 text-sm">Investissez dans les énergies renouvelables</p>
        </div>
        <div className="card shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
