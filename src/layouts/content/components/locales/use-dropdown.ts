import { DropdownOption } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import cookies from 'js-cookie'
import { useLocalesStore } from '@/store/locales/locales'
import type { Locales } from '@/store/locales/types'

export function useDropDown(chooseVal: any) {
  const { locale } = useI18n()
  const localesStore = useLocalesStore()

  const handleSelect = (key: string | number, option: DropdownOption) => {
    // console.log(key, option)
    chooseVal.value = option.label
    locale.value = key as Locales
    localesStore.setLocales(locale.value as Locales)
    cookies.set('language', locale.value, { path: '/' })
  }
  return {
    handleSelect
  }
}
