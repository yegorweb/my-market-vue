import { defineStore } from "pinia"
import AuthAPI from "../api/AuthAPI"
import { User } from "../types/user.interface"
import { ref } from "vue"

export const useAuth = defineStore('auth', () => {
  let user = ref<User | null>()
  let redirectTo = ref<string>('/')

  async function registration(data: any): Promise<boolean> {
    try {
      const response = await AuthAPI.registration(data)
      localStorage.setItem('token', response.data.accessToken)

      user.value = response.data.user
      
      localStorage.setItem('newUser', 'true')
      return true
    } catch {
      return false
    }
  }

  async function login(email: string, password: string): Promise<string | false> {
    try {
      const response = await AuthAPI.login(email, password)
      localStorage.setItem('token', response.data.accessToken)

      user.value = response.data.user
      return redirectTo.value
    } catch {
      return false
    }
  }

  async function checkAuth(): Promise<void> {
    try {
      if (!localStorage.getItem('token'))
        return
        
      const response = await AuthAPI.refresh()
      localStorage.setItem('token', response.data.accessToken)

      user.value = response.data.user
    } catch {
      await logout()
    }
  }

  async function logout(): Promise<void> {
    try {
      localStorage.removeItem('token')
      await AuthAPI.logout()
      user.value = null

      localStorage.removeItem('newUser')
    } catch {}
  }

  async function updateUser(new_user: any) {
    try {
      user.value = (await AuthAPI.updateUser(new_user)).data
    } catch {}
  }

  return { user, redirectTo, registration, login, checkAuth, logout, updateUser }
})
