import { defineComponent, ref, PropType } from 'vue'
import { NDropdown, NIcon, NButton } from 'naive-ui'
import styles from './index.module.scss'
import { DownOutlined } from '@vicons/antd'
import { useDropDown } from './use-dropdown'
import { useLocalesStore } from '@/store/locales/locales'

const Locales = defineComponent({
  name: 'Locales',
  props: {
    localesOptions: {
      type: Array as PropType<any>,
      default: []
    }
  },
  setup(props) {
    const localesStore = useLocalesStore()
    const chooseVal = ref(
      props.localesOptions.filter(
        (item: { key: string }) => item.key === localesStore.getLocales
      )[0].label
    )
    const { handleSelect } = useDropDown(chooseVal)

    return { handleSelect, chooseVal }
  },
  render() {
    return (
      <NDropdown
        trigger='hover'
        show-arrow
        options={this.localesOptions}
        on-select={this.handleSelect}
      >
        <NButton text>
          {this.chooseVal}
          <NIcon class={styles.icon}>
            <DownOutlined />
          </NIcon>
        </NButton>
      </NDropdown>
    )
  }
})

export default Locales
