import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { AppDispatch, RootState } from '../../store'
import { register as registerAction } from '../../store/authSlice'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading } = useSelector((s: RootState) => s.auth)
  const [showPass, setShowPass] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch } = useForm()

  const onSubmit = async (data: any) => {
    const result = await dispatch(registerAction(data))
    if (registerAction.fulfilled.match(result)) navigate('/dashboard')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Créer un compte</h2>
      <p className="text-gray-500 text-sm mb-6">Commencez à investir dans les énergies vertes</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Prénom</label>
            <input {...register('firstName', { required: true })} className="input" placeholder="Jean" />
          </div>
          <div>
            <label className="label">Nom</label>
            <input {...register('lastName', { required: true })} className="input" placeholder="Dupont" />
          </div>
        </div>

        <div>
          <label className="label">Email</label>
          <input {...register('email', { required: true })} type="email" className="input" placeholder="vous@exemple.com" />
        </div>

        <div>
          <label className="label">Téléphone</label>
          <input {...register('phone')} type="tel" className="input" placeholder="+225 00 00 00 00" />
        </div>

        <div>
          <label className="label">Type de compte</label>
          <select {...register('role')} className="input">
            <option value="user">Investisseur</option>
            <option value="promoter">Promoteur de projet</option>
          </select>
        </div>

        <div>
          <label className="label">Mot de passe</label>
          <div className="relative">
            <input
              {...register('password', { required: true, minLength: 8 })}
              type={showPass ? 'text' : 'password'}
              className="input pr-10"
              placeholder="Minimum 8 caractères"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-2.5 text-gray-400">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading && <Loader2 size={16} className="animate-spin" />}
          Créer mon compte
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-primary-600 font-medium hover:underline">Se connecter</Link>
      </div>
    </div>
  )
}
