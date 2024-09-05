import { reactive, inject, watch, onMounted } from 'vue'
import _ from 'lodash'
import { getTimeEvent } from '@/service/modules/animation'

interface TimeEvent {
  data: string
  timeVal: number
  italic: boolean
  weight: boolean
  color: string | null
}

interface AnimateData {
  shouldAnimate: boolean
  time: number
}

export function useTimeEvent(taskId: string, url: string) {
  const variables = reactive({
    eventList: [] as TimeEvent[],
    timeEventList: [] as TimeEvent[]
  })

  // 获取任务中事件列表
  const timeEvent = () => {
    getTimeEvent({ taskId: taskId }, url).then((res: TimeEvent[]) => {
      variables.eventList = res.map((item) => item)
      variables.eventList = _.orderBy(variables.eventList, ['timeVal'])
    })
  }

  // 查找事件
  const findEvents = _.throttle((time: number) => {
    let arr = _.filter(variables.eventList, (o: TimeEvent) => {
      return o.timeVal <= time
    })
    variables.timeEventList = arr.slice(-5).reverse()
  }, 500)

  const animateData: AnimateData = inject('AnimateData') || {
    shouldAnimate: false,
    time: 0
  }

  watch(
    () => animateData.time,
    (value) => {
      findEvents(value)
    }
  )

  onMounted(() => {
    timeEvent()
  })

  return { variables }
}
