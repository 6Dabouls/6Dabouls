import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { AppDispatch, RootState } from '../../store'
import { login } from '../../store/authSlice'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, requires2FA } = useSelector((s: RootState) => s.auth)
  const [showPass, setShowPass] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data: any) => {
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) {
      if (result.payload.requiresTwoFactor) {
        navigate('/2fa')
      } else {
        navigate('/dashboard')
      }
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Connexion</h2>
      <p className="text-gray-500 text-sm mb-6">Accédez à votre espace investisseur</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            {...register('email', { required: 'Email requis' })}
            type="email"
            className="input"
            placeholder="vous@exemple.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
        </div>

        <div>
          <label className="label">Mot de passe</label>
          <div className="relative">
            <input
              {...register('password', { required: 'Mot de passe requis' })}
              type={showPass ? 'text' : 'password'}
              className="input pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading && <Loader2 size={16} className="animate-spin" />}
          Se connecter
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        Pas encore de compte ?{' '}
        <Link to="/register" className="text-primary-600 font-medium hover:underline">S'inscrire</Link>
      </div>
    </div>
  )
}
