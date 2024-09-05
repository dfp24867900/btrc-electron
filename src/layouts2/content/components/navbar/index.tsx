import {
  defineComponent,
  PropType,
  ref,
  watch,
  reactive,
  onMounted,
  nextTick
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import styles from './index.module.scss'
import { NMenu, NDropdown, NButton, NIcon } from 'naive-ui'
import { MenuOutlined } from '@vicons/antd'
import Logo from '../logo'
import Locales from '../locales'
import Timezone from '../timezone'
import User from '../user'
import Theme from '../theme'

const Navbar = defineComponent({
  name: 'Navbar',
  props: {
    headerMenuOptions: {
      type: Array as PropType<any>,
      default: []
    },
    localesOptions: {
      type: Array as PropType<any>,
      default: []
    },
    timezoneOptions: {
      type: Array as PropType<any>,
      default: []
    },
    userDropdownOptions: {
      type: Array as PropType<any>,
      default: []
    }
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const navMenuRef = ref()

    const menuKey = ref(route.meta.activeMenu as string)

    const handleMenuClick = (key: string) => {
      router.push({ path: `/${key}` })
    }

    const menu = reactive({
      showMenu: [],
      hideMenu: [],
      hideMenuAction: false
    })

    watch(
      () => route.path,
      () => {
        menuKey.value = route.meta.activeMenu as string
        initNavMenu()
      }
    )

    const initNavMenu = () => {
      let showMenuLength = Math.floor(navMenuRef.value.clientWidth / 128) - 1
      menu.showMenu = props.headerMenuOptions.slice(0, showMenuLength)
      menu.hideMenu = props.headerMenuOptions.slice(showMenuLength)
      menu.hideMenuAction = menu.hideMenu.some((a: any) => {
        return (
          a.key === route.meta.activeMenu ||
          a.children?.some((b: any) => b.key === route.meta.activeMenu)
        )
      })
    }

    onMounted(async () => {
      await nextTick()
      initNavMenu()
      addEventListener('resize', initNavMenu)
    })

    return { navMenuRef, handleMenuClick, menuKey, menu }
  },
  render() {
    return (
      <div class={styles.container}>
        <Logo />
        <div ref='navMenuRef' class={styles.nav}>
          <NMenu
            value={this.menuKey}
            mode='horizontal'
            options={this.menu.showMenu}
            onUpdateValue={this.handleMenuClick}
          />
          {this.menu.hideMenu.length > 0 && (
            <NDropdown
              trigger='hover'
              show-arrow
              value={this.menuKey}
              options={this.menu.hideMenu}
              on-select={this.handleMenuClick}
              size='large'
            >
              <NButton
                class={styles.more}
                style={{
                  color: this.menu.hideMenuAction
                    ? 'var(--n-text-color-pressed)'
                    : ''
                }}
                text
                focusable={false}
              >
                <NIcon size={'1rem'} style={'margin-right:10px;'}>
                  <MenuOutlined />
                </NIcon>
                {'更多'}
              </NButton>
            </NDropdown>
          )}
        </div>
        <div class={styles.settings}>
          <Theme />
          {/* <Locales localesOptions={this.localesOptions} /> */}
          {/* <Timezone timezoneOptions={this.timezoneOptions} /> */}
          <User userDropdownOptions={this.userDropdownOptions} />
        </div>
      </div>
    )
  }
})

export default Navbar
