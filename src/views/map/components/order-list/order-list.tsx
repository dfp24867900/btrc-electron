import { defineComponent, PropType } from 'vue'
import { NScrollbar } from 'naive-ui'
import { format } from 'date-fns'
import { parseTime } from '@/common/common'
import { useTimeEvent } from './use-order'
import Styles from './index.module.scss'

const props = {
  taskId: {
    type: String as PropType<string>,
    default: ''
  }
}

const OrderList = defineComponent({
  name: 'OrderList',
  props,
  setup(props) {
    const { variables } = useTimeEvent(props.taskId)

    return { variables }
  },
  render() {
    return (
      <div
        class={[Styles.content]}
        style={{
          right: this.variables.show ? '10px' : '-201px'
        }}
      >
        <div class={[Styles.siderMenu]}>
          <div
            class={[Styles.siderButton]}
            onClick={() => (this.variables.show = !this.variables.show)}
          >
            电子看板
          </div>
        </div>

        <NScrollbar class={[Styles.container]} style={{ maxHeight: '200px' }}>
          <div class={[Styles.labels]}>
            {this.variables.timeEventList.map((item, index) => (
              <div class={[Styles.labelItem]}>
                <p
                  class={[Styles.labelText]}
                  style={{
                    color: item.color ? item.color : '',
                    fontStyle: item.italic ? 'italic' : '',
                    fontWeight: item.weight ? 'bold' : 'normal',
                    opacity: 1 - index * 0.15
                  }}
                >
                  {format(parseTime(item.timeVal), 'HH:mm:ss')}：{item.data}
                </p>
              </div>
            ))}
          </div>
        </NScrollbar>
      </div>
    )
  }
})

export default OrderList
