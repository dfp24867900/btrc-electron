import { defineComponent, PropType } from 'vue'
import { NDropdown, NIcon, NButton } from 'naive-ui'
import { DownOutlined, UserOutlined } from '@vicons/antd'
import { useDropDown } from './use-dropdown'
import { useUserStore } from '@/store/user/user'
import styles from './index.module.scss'
import type { UserInfoRes } from '@/service/modules/users/types'

const User = defineComponent({
  name: 'User',
  props: {
    userDropdownOptions: {
      type: Array as PropType<any>,
      default: []
    }
  },
  setup() {
    const { handleSelect } = useDropDown()
    const userStore = useUserStore()

    return { handleSelect, userStore }
  },
  render() {
    return (
      <NDropdown
        trigger='hover'
        show-arrow
        options={this.userDropdownOptions}
        on-select={this.handleSelect}
      >
        <NButton text>
          <NIcon class={styles.icon}>
            <UserOutlined />
          </NIcon>
          {(this.userStore.getUserInfo as UserInfoRes).userName}
          <NIcon class={styles.icon}>
            <DownOutlined />
          </NIcon>
        </NButton>
      </NDropdown>
    )
  }
})

export default User
