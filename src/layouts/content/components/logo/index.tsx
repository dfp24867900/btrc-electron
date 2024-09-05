import { defineComponent } from 'vue'
import { useThemeStore } from '@/store/theme/theme'
import styles from './index.module.scss'
import { useRouter } from 'vue-router'

const projectId = Number(import.meta.env.VITE_APP_PROJECT)
const Logo = defineComponent({
  name: 'Logo',
  setup() {
    const themeStore = useThemeStore()
    const router = useRouter()

    return { themeStore, router }
  },
  render() {
    return projectId != 4 ? (
      <div
        class={[
          styles.logo,
          styles[`logo-${this.themeStore.darkTheme ? 'dark' : 'light'}`]
        ]}
      >
        <a
          class={[
            styles.logo,
            styles[`logo-${this.themeStore.darkTheme ? 'dark' : 'light'}`]
          ]}
          href='javascript:;'
          style={{ textDecoration: 'none' }}
          // onClick={() => {
          //   this.router.push({ path: '/bigData' })
          // }}
        ></a>
      </div>
    ) : (
      <div class={styles['title']}>机器学习算法平台</div>
    )
  }
})

export default Logo
