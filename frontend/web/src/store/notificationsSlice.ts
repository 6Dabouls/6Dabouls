import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { notificationsApi } from '../services/api'
import { Notification } from '../types'

interface NotificationsState {
  items: Notification[]
  unreadCount: number
  loading: boolean
}

const initialState: NotificationsState = { items: [], unreadCount: 0, loading: false }

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async () => {
  const res = await notificationsApi.getAll()
  return res.data
})

export const fetchUnreadCount = createAsyncThunk('notifications/unreadCount', async () => {
  const res = await notificationsApi.getUnreadCount()
  return res.data
})

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchNotifications.pending, (s) => { s.loading = true })
     .addCase(fetchNotifications.fulfilled, (s, a) => {
       s.loading = false
       s.items = a.payload[0] || []
     })
     .addCase(fetchUnreadCount.fulfilled, (s, a) => { s.unreadCount = a.payload })
  },
})

export default notificationsSlice.reducer
