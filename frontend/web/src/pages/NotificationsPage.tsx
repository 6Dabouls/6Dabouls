import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { notificationsApi } from '../services/api'
import { fetchUnreadCount } from '../store/notificationsSlice'
import { AppDispatch } from '../store'
import { Notification } from '../types'
import { Bell, CheckCheck } from 'lucide-react'

export default function NotificationsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [notifications, setNotifications] = useState<Notification[]>([])

  const load = () => {
    notificationsApi.getAll({ limit: 50 }).then(r => setNotifications(r.data[0] || []))
  }

  useEffect(() => { load() }, [])

  const markAll = async () => {
    await notificationsApi.markAllRead()
    load()
    dispatch(fetchUnreadCount())
  }

  const markOne = async (id: string) => {
    await notificationsApi.markRead(id)
    load()
    dispatch(fetchUnreadCount())
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {notifications.some(n => !n.isRead) && (
          <button onClick={markAll} className="btn-secondary text-sm flex items-center gap-1">
            <CheckCheck size={14} /> Tout marquer lu
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card text-center py-16">
          <Bell size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">Aucune notification</p>
        </div>
      ) : notifications.map(n => (
        <div
          key={n.id}
          onClick={() => !n.isRead && markOne(n.id)}
          className={`card cursor-pointer transition-colors ${!n.isRead ? 'border-primary-200 bg-primary-50/30' : ''}`}
        >
          <div className="flex items-start gap-3">
            {!n.isRead && <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />}
            <div className="flex-1">
              <div className="font-medium text-sm">{n.title}</div>
              <div className="text-gray-500 text-sm mt-0.5">{n.message}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString('fr-FR')}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
