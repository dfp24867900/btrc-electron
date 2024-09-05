import { WritableComputedRef } from 'vue'
import { useLocalesStore } from '@/store/locales/locales'
import type { Locales } from '@/store/locales/types'
import cookies from 'js-cookie'

export function useTranslate(locale: WritableComputedRef<string>) {
  const localesStore = useLocalesStore()

  const handleChange = (value: Locales) => {
    locale.value = value
    localesStore.setLocales(value)
    cookies.set('language', locale.value, { path: '/' })
  }
  return {
    handleChange
  }
}
