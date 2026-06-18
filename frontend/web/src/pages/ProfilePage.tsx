import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { RootState, AppDispatch } from '../store'
import { fetchMe } from '../store/authSlice'
import { usersApi } from '../services/api'
import toast from 'react-hot-toast'
import { User, Shield, Bell } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useSelector((s: RootState) => s.auth)
  const dispatch = useDispatch<AppDispatch>()
  const { register, handleSubmit, reset } = useForm({ defaultValues: user || {} })
  const { register: regPwd, handleSubmit: submitPwd, reset: resetPwd } = useForm()

  useEffect(() => { if (user) reset(user) }, [user, reset])

  const onUpdateProfile = async (data: any) => {
    await usersApi.updateMe(data)
    dispatch(fetchMe())
    toast.success('Profil mis à jour')
  }

  const onChangePassword = async (data: any) => {
    await usersApi.changePassword(data)
    resetPwd()
    toast.success('Mot de passe modifié')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
      </div>

      {/* Profile info */}
      <form onSubmit={handleSubmit(onUpdateProfile)} className="card space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <User size={20} className="text-primary-600" />
          <h3 className="font-semibold">Informations personnelles</h3>
        </div>

        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-2xl font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Prénom</label>
            <input {...register('firstName')} className="input" />
          </div>
          <div>
            <label className="label">Nom</label>
            <input {...register('lastName')} className="input" />
          </div>
          <div>
            <label className="label">Email</label>
            <input {...register('email')} type="email" className="input" disabled />
          </div>
          <div>
            <label className="label">Téléphone</label>
            <input {...register('phone')} className="input" />
          </div>
          <div>
            <label className="label">Pays</label>
            <input {...register('country')} className="input" />
          </div>
          <div>
            <label className="label">Ville</label>
            <input {...register('city')} className="input" />
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm">
          <Shield size={16} className="text-primary-500" />
          <span>KYC: <strong className={`capitalize ${user?.kycStatus === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>{user?.kycStatus}</strong></span>
        </div>

        <button type="submit" className="btn-primary">Sauvegarder</button>
      </form>

      {/* Change password */}
      <form onSubmit={submitPwd(onChangePassword)} className="card space-y-4">
        <h3 className="font-semibold">Changer le mot de passe</h3>
        <div>
          <label className="label">Mot de passe actuel</label>
          <input {...regPwd('currentPassword', { required: true })} type="password" className="input" />
        </div>
        <div>
          <label className="label">Nouveau mot de passe</label>
          <input {...regPwd('newPassword', { required: true, minLength: 8 })} type="password" className="input" />
        </div>
        <button type="submit" className="btn-primary">Modifier le mot de passe</button>
      </form>

      {/* Notifications */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Bell size={20} className="text-primary-600" />
          <h3 className="font-semibold">Préférences de notifications</h3>
        </div>
        {[
          { key: 'email', label: 'Notifications par email' },
          { key: 'push', label: 'Notifications push' },
          { key: 'sms', label: 'Notifications SMS' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{label}</span>
            <input
              type="checkbox"
              defaultChecked={user?.notificationPreferences?.[key as any] ?? true}
              className="w-4 h-4 accent-primary-600"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
