import { defineStore } from 'pinia'
import { timezoneStore, Timezone } from './types'

export const useTimezoneStore = defineStore({
  id: 'timezone',
  state: (): timezoneStore => ({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }),
  persist: true,
  getters: {
    getTimezone(): Timezone {
      return this.timezone
    }
  },
  actions: {
    setTimezone(timezone: Timezone): void {
      this.timezone = timezone
    }
  }
})
