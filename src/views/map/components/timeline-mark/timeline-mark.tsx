import { defineComponent, PropType } from 'vue'
import { NTooltip } from 'naive-ui'
import Styles from './index.module.scss'

const props = {
  timelineMarkList: {
    type: Array as PropType<any[]>,
    default: []
  }
}

const TimelineMark = defineComponent({
  name: 'timeline-mark',
  props,
  render(props: { timelineMarkList: any[] }) {
    return (
      <div class={[Styles.container]}>
        <div class={[Styles.list]}>
          {props.timelineMarkList.map((item) => (
            <NTooltip>
              {{
                default: () => `${item.title}`,
                trigger: () => (
                  <div
                    class={[Styles.timeline_mark]}
                    style={{
                      width: `${item.width}%`,
                      left: `${item.left}%`,
                      // borderColor: item.color,
                      backgroundColor: item.color
                    }}
                  ></div>
                )
              }}
            </NTooltip>
          ))}
        </div>
      </div>
    )
  }
})

export default TimelineMark
