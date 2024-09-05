import { defineComponent, PropType } from 'vue'
import { format } from 'date-fns'
import { parseTime } from '@/common/common'
import { useTimeEvent } from './use-order'
import Styles from './index.module.scss'

const props = {
  taskId: {
    type: String as PropType<string>,
    default: ''
  },
  url: {
    type: String as PropType<string>,
    default: '/task-analyzer/bulletinBoard'
  }
}

const OrderList = defineComponent({
  name: 'OrderList',
  props,
  setup(props) {
    const { variables } = useTimeEvent(props.taskId, props.url)

    return { variables }
  },
  render() {
    return (
      <div class={[Styles.container]}>
        {this.variables.timeEventList.map((item, index) => (
          <div class={[Styles.item]}>
            <span
              class={[Styles.item_span]}
              style={{
                color: item.color ? item.color : '',
                fontStyle: item.italic ? 'italic' : '',
                fontWeight: item.weight ? 'bold' : 'normal',
                opacity: 1 - index * 0.15
              }}
            >
              {format(parseTime(item.timeVal), 'HH:mm:ss')}：{item.data}
            </span>
          </div>
        ))}
      </div>
    )
  }
})

export default OrderList
