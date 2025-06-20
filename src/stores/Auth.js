import { defineStore } from 'pinia'
import axios from 'axios'
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as PusherPushNotifications from '@pusher/push-notifications-web'

export const useAuthStore = defineStore('Auth', {
  state: () => ({
    authUser: useStorage('authUser', {}),
    authenticated: useStorage('authenticated', false),
    userPermissions: useStorage('userPermissions', []),
    type: useStorage('type', ''),
    authErrors: [],
    role: '',
    token: useStorage('token', null),
    msg: '',
    loading: ref(false),
    router: useRouter(),
  }),
  getters: {
    user: (state) => state.authUser,
    permissions: (state) => state.userPermissions,
    errors: (state) => state.authErrors,
    successMsg: (state) => state.msg,
    isAuthenticated: (state) => state.authenticated,
  },
  actions: {
    async getUser() {
      if (this.authenticated && this.token) {
        try {
          const response = await axios.get('api/get-user', {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          })
          this.authUser = response.data.data.user
          return response.data.data.user
        } catch (error) {
          this.handleLogout()
          throw error
        }
      }
      return null
    },

    async handleLogin(data) {
      this.loading = true
      this.authErrors = []

      try {
        const response = await axios.post('/api/login', {
          email: data.email,
          password: data.password,
        })

        if (response.data.success && response.data.data?.token) {
          this.authenticated = true
          this.token = response.data.data.token
          this.authUser = response.data.data.user
          this.msg = response.data.info

          // Initialize Pusher Beams if needed
          if (response.data.data.user.id) {
            const beamsTokenProvider = new PusherPushNotifications.TokenProvider({
              url: `${import.meta.env.VITE_API}/pusher/beams-auth`,
              queryParams: {
                user_id: `${response.data.data.user.id}`,
              },
              headers: {
                Authorization: `Bearer ${response.data.data.token}`,
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*',
                Origin: import.meta.env.VITE_URI,
              },
            })

            const beamsClient = new PusherPushNotifications.Client({
              instanceId: '140343aa-f173-4a2d-940a-7724c7c12be1',
            })

            beamsClient
              .start()
              .then(() => {
                beamsClient.setUserId(`${response.data.data.user.id}`, beamsTokenProvider)
              })
              .catch((error) => {
                console.error('Pusher Beams error:', error)
              })
          }

          this.router.push({ name: 'home' })
          return true
        } else {
          this.authErrors = [response.data.info || "Login failed"]
          return false
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 422) {
            this.authErrors = error.response.data.errors
              ? Object.values(error.response.data.errors).flat()
              : ["Validation failed. Please check your inputs."]
          } else if (error.response.status === 401) {
            this.authErrors = [error.response.data.info || "Invalid credentials"]
          } else {
            this.authErrors = [error.response.data.info || error.response.data.message || "An error occurred"]
          }
        } else if (error.request) {
          this.authErrors = ["Network error. Please check your connection."]
        } else {
          this.authErrors = ["An unexpected error occurred"]
        }
        return false
      } finally {
        this.loading = false
      }
    },

    async handleRegister(data) {
      if (this.loading) return
      this.resetAuthStore()
      this.loading = true
      try {
        const response = await axios.post('/api/register', {
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        })

        if (response.data.success) {
          this.authenticated = true
          this.token = response.data.data.token
          this.authUser = response.data.data.user
          this.msg = response.data.info
          this.router.push({ name: 'home' })
          return true
        } else {
          this.authErrors = [response.data.info || "Registration failed"]
          return false
        }
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ["Validation failed. Please check your inputs."]
        } else {
          this.authErrors = [error.response?.data?.info || error.response?.data?.message || "Registration failed"]
        }
        return false
      } finally {
        this.loading = false
      }
    },

    async handleLogout() {
      try {
        await axios.post('/api/logout', {}, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.resetAuthStore()
        this.router.push({ name: 'login' })
      }
    },

    async forgotPassword(data) {
      try {
        this.resetAuthStore()
        const response = await axios.post('/api/forgot-password', {
          email: data.email,
        })

        if (response.data.success) {
          this.msg = response.data.info
          this.router.push({ name: 'reset-password' })
          return true
        } else {
          this.authErrors = [response.data.info || "Request failed"]
          return false
        }
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors = Object.values(error.response.data.errors).flat()
        } else {
          this.authErrors = [error.response?.data?.info || "Request failed"]
        }
        return false
      }
    },

    async resetPassword(data) {
      try {
        const response = await axios.post('/api/reset-password', data)

        if (response.data.success) {
          this.msg = response.data.info
          this.router.push({ name: 'login' })
          return true
        } else {
          this.authErrors = [response.data.info || "Password reset failed"]
          return false
        }
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors = Object.values(error.response.data.errors).flat()
        } else {
          this.authErrors = [error.response?.data?.info || "Password reset failed"]
        }
        return false
      }
    },

    resetAuthStore() {
      this.authUser = null
      this.token = null
      this.type = ''
      this.authenticated = false
      this.userPermissions = null
      this.authErrors = []
      this.msg = ''
      this.loading = false
    },
  },
})
