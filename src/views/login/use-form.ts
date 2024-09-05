import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormRules } from 'naive-ui'

export function useForm() {
  const { t, locale } = useI18n()

  const state = reactive({
    loginFormRef: ref(),
    loginForm: {
      userName: 'admin',
      userPassword: 'btrc123'
    },
    rules: {
      userName: {
        trigger: ['input', 'blur'],
        validator() {
          if (state.loginForm.userName === '') {
            return new Error(t('login.userName_tips'))
          }
        }
      },
      userPassword: {
        trigger: ['input', 'blur'],
        validator() {
          if (state.loginForm.userPassword === '') {
            return new Error(t('login.userPassword_tips'))
          }
        }
      }
    } as FormRules
  })

  return {
    state,
    t,
    locale
  }
}
