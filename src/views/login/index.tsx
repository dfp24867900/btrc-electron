import { defineComponent, toRefs, withKeys, ref, computed } from 'vue'
import styles from './index.module.scss'
import {
  NInput,
  NButton,
  NSwitch,
  NForm,
  NFormItem,
  useMessage,
  NConfigProvider,
  darkTheme
} from 'naive-ui'
import { useForm } from './use-form'
import { useTranslate } from './use-translate'
import { useLogin } from './use-login'
import { useLocalesStore } from '@/store/locales/locales'
import { useThemeStore } from '@/store/theme/theme'
import cookies from 'js-cookie'
import { MAX_LENGTH_LIMIT } from '@/common/length-limit'

const login = defineComponent({
  name: 'login',
  setup() {
    window.$message = useMessage()

    const { state, t, locale } = useForm()
    const loading = ref(false)
    const { handleChange } = useTranslate(locale)
    const { handleLogin } = useLogin(state, loading)
    const localesStore = useLocalesStore()
    const themeStore = useThemeStore()

    const currentTheme = computed(() => darkTheme)

    if (themeStore.getTheme) {
      themeStore.setDarkTheme()
    }

    cookies.set('language', localesStore.getLocales, { path: '/' })

    return {
      t,
      handleChange,
      handleLogin,
      ...toRefs(state),
      localesStore,
      loading,
      currentTheme
    }
  },
  render() {
    return (
      <NConfigProvider theme={this.currentTheme}>
        <div class={styles.container}>
          {/* <div class={styles['language-switch']}>
          <NSwitch
            onUpdateValue={this.handleChange}
            default-value={this.localesStore.getLocales}
            checked-value='en_US'
            unchecked-value='zh_CN'
          >
            {{
              checked: () => 'en_US',
              unchecked: () => 'zh_CN'
            }}
          </NSwitch>
        </div> */}
          <p class={styles['login-text']}>
            <p>智 能 数 据 管 理</p>
            <p>
              变 革&nbsp;&nbsp;&nbsp;&nbsp;转 型&nbsp;&nbsp;&nbsp;&nbsp;突 破
            </p>
          </p>
          <div class={styles['login-model']}>
            <div class={styles.logo}>
              <p>登录</p>
            </div>
            <div class={styles['form-model']}>
              <NForm rules={this.rules} ref='loginFormRef'>
                <NFormItem
                  label={this.t('login.userName')}
                  label-style={{ color: 'white' }}
                  path='userName'
                >
                  <NInput
                    class='input-user-name'
                    type='text'
                    size='large'
                    v-model={[this.loginForm.userName, 'value']}
                    placeholder={this.t('login.userName_tips')}
                    disabled={this.loading}
                    autofocus
                    onKeydown={withKeys(this.handleLogin, ['enter'])}
                    maxlength={MAX_LENGTH_LIMIT.text}
                  />
                </NFormItem>
                <NFormItem
                  label={this.t('login.userPassword')}
                  label-style={{ color: 'white' }}
                  path='userPassword'
                >
                  <NInput
                    class='input-password'
                    type='password'
                    size='large'
                    v-model={[this.loginForm.userPassword, 'value']}
                    placeholder={this.t('login.userPassword_tips')}
                    disabled={this.loading}
                    onKeydown={withKeys(this.handleLogin, ['enter'])}
                    maxlength={MAX_LENGTH_LIMIT.password}
                  />
                </NFormItem>
              </NForm>
              <NButton
                class='btn-login'
                round
                type='info'
                style={{ width: '100%', color: '#fff' }}
                onClick={this.handleLogin}
                loading={this.loading}
                focusable={false}
              >
                {this.t('login.login')}
              </NButton>
            </div>
          </div>
        </div>
      </NConfigProvider>
    )
  }
})

export default login
