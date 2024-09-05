import { defineStore } from 'pinia'
import { LocalesStore, Locales } from './types'

export const useLocalesStore = defineStore({
  id: 'locales',
  state: (): LocalesStore => ({
    locales: 'zh_CN'
  }),
  persist: true,
  getters: {
    getLocales(): Locales {
      return this.locales
    }
  },
  actions: {
    setLocales(lang: Locales): void {
      this.locales = lang
    }
  }
})
