/* eslint-disable @typescript-eslint/ban-types */
import React, { createContext, useCallback, useState, useContext } from 'react'
import api from '../services/api'

interface AuthState {
  token: string
  user: Object
}

interface SingInCredentials {
  email: string
  password: string
}

interface AuthContextData {
  user: Object
  signIn(credentials: SingInCredentials): Promise<void>
  signOut(): void
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token')
    const user = localStorage.getItem('@GoBarber:user')

    if (token && user) {
      return { token, user: JSON.parse(user) }
    }

    return {} as AuthState
  })

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    })

    const { token, user } = response.data

    localStorage.setItem('@GoBarber:token', token)
    localStorage.setItem('@GoBarber:user', JSON.stringify(user))

    setData({ token, user })
  }, [])

  const signOut = useCallback(async () => {
    localStorage.removeItem('@GoBarber:token')
    localStorage.removeItem('@GoBarber:user')

    setData({} as AuthState)
  }, [])

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider')
  }

  return context
}

export default AuthContext
