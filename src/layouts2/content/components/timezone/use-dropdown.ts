import { updateUser } from '@/service/modules/users'
import { useTimezoneStore } from '@/store/timezone/timezone'
import { useUserStore } from '@/store/user/user'
import type { UserInfoRes } from '@/service/modules/users/types'

export function useDropDown(chooseVal: any, reload: any) {
  const userStore = useUserStore()
  const timezoneStore = useTimezoneStore()
  const userInfo = userStore.userInfo as UserInfoRes

  const handleSelect = (key: string) => {
    updateUser({
      userPassword: '',
      id: userInfo.id,
      userName: '',
      tenantId: userInfo.tenantId,
      email: '',
      phone: userInfo.phone,
      state: userInfo.state,
      timeZone: key
    }).then(() => {
      chooseVal.value = key
      timezoneStore.setTimezone(key as string)
      reload()
    })
  }

  return {
    handleSelect
  }
}
