import { defineComponent, PropType, renderSlot } from 'vue'
import { NButton } from 'naive-ui'
import styles from './index.module.scss'

const props = {
  disabled: {
    type: Boolean,
    default: false
  },
  iconPlacement: {
    type: String as PropType<'left' | 'right'>,
    default: 'left'
  }
}

const ButtonLink = defineComponent({
  name: 'button-link',
  props,
  emits: ['click'],
  setup(props, { slots, emit }) {
    const onClick = (ev: MouseEvent) => {
      emit('click', ev)
    }
    return () => (
      <NButton {...props} onClick={onClick} text class={styles['button-link']}>
        {{
          default: () => renderSlot(slots, 'default'),
          icon: () => renderSlot(slots, 'icon')
        }}
      </NButton>
    )
  }
})

export default ButtonLink
