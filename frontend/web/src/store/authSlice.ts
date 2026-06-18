import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authApi, usersApi } from '../services/api'
import { User } from '../types'

interface AuthState {
  user: User | null
  accessToken: string | null
  loading: boolean
  requires2FA: boolean
  pendingUserId: string | null
}

const stored = localStorage.getItem('user')
const initialState: AuthState = {
  user: stored ? JSON.parse(stored) : null,
  accessToken: localStorage.getItem('accessToken'),
  loading: false,
  requires2FA: false,
  pendingUserId: null,
}

export const login = createAsyncThunk('auth/login', async (data: any) => {
  const res = await authApi.login(data)
  return res.data
})

export const register = createAsyncThunk('auth/register', async (data: any) => {
  const res = await authApi.register(data)
  return res.data
})

export const verify2FA = createAsyncThunk('auth/verify2FA', async (data: any) => {
  const res = await authApi.verify2fa(data)
  return res.data
})

export const fetchMe = createAsyncThunk('auth/fetchMe', async () => {
  const res = await usersApi.getMe()
  return res.data
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.accessToken = null
      state.requires2FA = false
      state.pendingUserId = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    },
    setCredentials(state, action: PayloadAction<{ user: User; accessToken: string }>) {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      localStorage.setItem('accessToken', action.payload.accessToken)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false
        if (a.payload.requiresTwoFactor) {
          s.requires2FA = true
          s.pendingUserId = a.payload.userId
        } else {
          s.user = a.payload.user
          s.accessToken = a.payload.accessToken
          localStorage.setItem('accessToken', a.payload.accessToken)
          localStorage.setItem('user', JSON.stringify(a.payload.user))
        }
      })
      .addCase(login.rejected, (s) => { s.loading = false })
      .addCase(register.pending, (s) => { s.loading = true })
      .addCase(register.fulfilled, (s, a) => {
        s.loading = false
        s.user = a.payload.user
        s.accessToken = a.payload.accessToken
        localStorage.setItem('accessToken', a.payload.accessToken)
        localStorage.setItem('user', JSON.stringify(a.payload.user))
      })
      .addCase(register.rejected, (s) => { s.loading = false })
      .addCase(verify2FA.fulfilled, (s, a) => {
        s.requires2FA = false
        s.pendingUserId = null
        s.user = a.payload.user
        s.accessToken = a.payload.accessToken
        localStorage.setItem('accessToken', a.payload.accessToken)
        localStorage.setItem('user', JSON.stringify(a.payload.user))
      })
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.user = a.payload
        localStorage.setItem('user', JSON.stringify(a.payload))
      })
  },
})

export const { logout, setCredentials } = authSlice.actions
export default authSlice.reducer
