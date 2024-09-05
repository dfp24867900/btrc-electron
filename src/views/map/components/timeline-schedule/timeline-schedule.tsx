import { defineComponent, PropType } from 'vue'
import Styles from './index.module.scss'

const props = {
  timelineSchedule: {
    type: Array as PropType<any[]>,
    default: []
  }
}

const TimelineSchedule = defineComponent({
  name: 'timeline-schedule',
  props,
  render() {
    return (
      <div class={[Styles.container]}>
        {this.timelineSchedule.map((item) => (
          <div
            class={[Styles.timeline_schedule]}
            style={{
              width: `${item.width}%`,
              left: `${item.left}%`
            }}
          ></div>
        ))}
      </div>
    )
  }
})

export default TimelineSchedule
