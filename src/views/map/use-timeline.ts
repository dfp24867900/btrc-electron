import { onMounted, onUnmounted, nextTick } from 'vue'
import * as Cesium from 'cesium'
import _ from 'lodash'
import type { ClockMessageType } from './cesium/types'

export function useTimeline(
  timeline: boolean = false,
  gotoTime: (data: { time: number }) => void,
  operationClock: (type: ClockMessageType, time?: number) => void
) {
  // 键盘事件
  const keydown = (e: { keyCode: number }) => {
    if (window.viewer) {
      switch (e.keyCode) {
        case 38: // 上
          operationClock('up')
          break
        case 40: // 下
          operationClock('down')
          break
        case 37: // 左
          operationClock('backward')
          break
        case 39: // 右
          operationClock('forward')
          break
        case 32: // 空格
          operationClock('should')
          break
        default:
      }
    }
  }

  // 时间轴事件
  const timelineEvent = () => {
    // 时间轴跳转时间
    let timelineDom = document.getElementsByClassName('cesium-timeline-bar')[0]
    const timelineTimeChange = _.throttle(() => {
      gotoTime({
        time: Cesium.JulianDate.toDate(
          window.viewer.clock.currentTime
        ).getTime()
      })
    }, 200)

    let onMouseup = () => {
      timelineTimeChange()
      window.removeEventListener('mouseup', onMouseup)
    }

    let onMousedown = () => {
      timelineTimeChange()
      window.addEventListener('mouseup', onMouseup)
    }

    timelineDom.addEventListener('mousedown', onMousedown)
  }

  onMounted(() => {
    if (!timeline) return
    nextTick(() => {
      timelineEvent()
    })
    addEventListener('keydown', keydown)
  })

  onUnmounted(() => {
    if (!timeline) return
    removeEventListener('keydown', keydown)
  })

  return { keydown }
}
