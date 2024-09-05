import { defineStore } from 'pinia'
import type { UserState } from '@/store/user/types'
import type { UserInfoRes } from '@/service/modules/users/types'

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    sessionId: '',
    userInfo: {},
    userAuth: []
  }),
  persist: true,
  getters: {
    getSessionId(): string {
      return this.sessionId
    },
    getUserInfo(): UserInfoRes | {} {
      return this.userInfo
    },
    getUserAuth(): string[] {
      return this.userAuth
    }
  },
  actions: {
    setSessionId(sessionId: string): void {
      this.sessionId = sessionId
    },
    setUserInfo(userInfo: UserInfoRes | {}): void {
      this.userInfo = userInfo
    },
    setUserAuth(userAuth: string[]): void {
      this.userAuth = [
        'login',
        'profile',
        'home',
        'password',
        'bigData',
        ...userAuth
      ]
    }
  }
})
