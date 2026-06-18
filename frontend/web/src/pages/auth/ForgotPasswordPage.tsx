import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authApi } from '../../services/api'
import toast from 'react-hot-toast'
import { Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit } = useForm()

  const onSubmit = async ({ email }: any) => {
    await authApi.forgotPassword(email)
    setSent(true)
    toast.success('Email envoyé si le compte existe')
  }

  if (sent) return (
    <div className="text-center">
      <Mail size={48} className="text-primary-600 mx-auto mb-4" />
      <h2 className="text-xl font-bold mb-2">Email envoyé</h2>
      <p className="text-gray-500 text-sm mb-4">Vérifiez votre boîte mail pour réinitialiser votre mot de passe.</p>
      <Link to="/login" className="text-primary-600 hover:underline text-sm">Retour à la connexion</Link>
    </div>
  )

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Mot de passe oublié</h2>
      <p className="text-gray-500 text-sm mb-6">Entrez votre email pour recevoir un lien de réinitialisation</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input {...register('email', { required: true })} type="email" className="input" />
        </div>
        <button type="submit" className="btn-primary w-full">Envoyer le lien</button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/login" className="text-sm text-primary-600 hover:underline">Retour à la connexion</Link>
      </div>
    </div>
  )
}
