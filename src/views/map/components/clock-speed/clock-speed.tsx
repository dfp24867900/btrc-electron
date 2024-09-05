import { defineComponent, inject, watch } from 'vue'
import { format } from 'date-fns'
import { parseTime } from '@/common/common'
import type { AnimateData } from './types'
import Styles from './index.module.scss'

const ClockSpeed = defineComponent({
  name: 'clock-speed',
  setup() {
    const animateData: AnimateData = inject('AnimateData') || {
      shouldAnimate: false,
      time: 0,
      clockMultiplier: 1
    }

    watch(
      () => animateData.time,
      () => {}
    )

    return {
      animateData
    }
  },

  render() {
    return (
      <p class={[Styles.clockContent]}>
        <span>
          {format(parseTime(this.animateData.time), 'yyyy-MM-dd HH:mm:ss')}
        </span>
        <span>x{this.animateData.clockMultiplier}</span>
      </p>
    )
  }
})

export default ClockSpeed
