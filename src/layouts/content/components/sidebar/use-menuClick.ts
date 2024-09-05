import { useRouter } from 'vue-router'
import type { Router } from 'vue-router'
import { MenuOption } from 'naive-ui'

export function useMenuClick() {
  const router: Router = useRouter()

  const handleMenuClick = (key: string, unused: MenuOption) => {
    router.push({ path: `${key}` })
  }

  return {
    handleMenuClick
  }
}
