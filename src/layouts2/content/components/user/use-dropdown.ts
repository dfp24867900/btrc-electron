import { useRouter } from 'vue-router'
import { logout } from '@/service/modules/logout'
import { useUserStore } from '@/store/user/user'
import type { Router } from 'vue-router'
import { DropdownOption } from 'naive-ui'
import cookies from 'js-cookie'

export function useDropDown() {
  const router: Router = useRouter()
  const userStore = useUserStore()

  const handleSelect = (key: string | number, unused: DropdownOption) => {
    if (key === 'logout') {
      useLogout()
    } else if (key === 'password') {
      router.push({ path: '/password' })
    } else if (key === 'profile') {
      router.push({ path: '/profile' })
    }
  }

  const useLogout = () => {
    logout().then(() => {
      userStore.setSessionId('')
      userStore.setUserInfo({})
      userStore.setUserAuth([])
      cookies.remove('sessionId')

      router.push({ path: '/login' })
    })
  }

  return {
    handleSelect
  }
}
