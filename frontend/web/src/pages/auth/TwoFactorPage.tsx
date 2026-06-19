import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { AppDispatch, RootState } from '../../store'
import { verify2FA } from '../../store/authSlice'
import { ShieldCheck } from 'lucide-react'

export default function TwoFactorPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { pendingUserId } = useSelector((s: RootState) => s.auth)
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data: any) => {
    const result = await dispatch(verify2FA({ ...data, userId: pendingUserId }))
    if (verify2FA.fulfilled.match(result)) navigate('/dashboard')
  }

  return (
    <div className="text-center">
      <ShieldCheck size={48} className="text-primary-600 mx-auto mb-4" />
      <h2 className="text-xl font-bold mb-2">Vérification en deux étapes</h2>
      <p className="text-gray-500 text-sm mb-6">Entrez le code de votre application d'authentification</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('token', { required: true })}
          className="input text-center text-2xl tracking-widest"
          placeholder="000000"
          maxLength={6}
        />
        <button type="submit" className="btn-primary w-full">Vérifier</button>
      </form>
    </div>
  )
}
