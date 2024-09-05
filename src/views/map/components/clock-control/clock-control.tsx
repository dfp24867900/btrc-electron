import { defineComponent, PropType } from 'vue'
import { NButton, NSpace, NButtonGroup, NIcon } from 'naive-ui'
import {
  PauseOutlined,
  CaretRightOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined
} from '@vicons/antd'
import Styles from './index.module.scss'

const props = {
  shouldAnimate: {
    type: Boolean as PropType<boolean>,
    default: 0
  }
}

const ClockControl = defineComponent({
  name: 'clock-control',
  props,
  emits: ['keydown'],
  setup(props, ctx) {
    const onKeydown = (key: string) => {
      ctx.emit('keydown', key)
    }
    return { onKeydown }
  },
  render(props: { shouldAnimate: boolean }) {
    return (
      <div class={[Styles.clockControl]}>
        <NSpace size={0}>
          <NButtonGroup>
            <NSpace size={8}>
              <NButton
                onClick={() => {
                  this.onKeydown('down')
                }}
                size='small'
                color='#fff'
                circle
                ghost
              >
                <NIcon>
                  <DoubleLeftOutlined />
                </NIcon>
              </NButton>
              <NButton
                onClick={() => {
                  this.onKeydown('should')
                }}
                size='small'
                color='#fff'
                circle
                ghost
              >
                <NIcon>
                  {props.shouldAnimate ? (
                    <PauseOutlined />
                  ) : (
                    <CaretRightOutlined />
                  )}
                </NIcon>
              </NButton>
              <NButton
                onClick={() => {
                  this.onKeydown('up')
                }}
                size='small'
                color='#fff'
                circle
                ghost
              >
                <NIcon>
                  <DoubleRightOutlined />
                </NIcon>
              </NButton>
            </NSpace>
          </NButtonGroup>
        </NSpace>
      </div>
    )
  }
})

export default ClockControl
