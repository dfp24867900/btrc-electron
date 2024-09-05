import { watch } from 'vue'
import { queryKeyEvent } from '@/service/modules/animation'
import type { IVariables, KeyEvent, KeyEventRes } from './types'
import type { MapVariables } from './cesium/types'

export function useKeyEvent(variables: IVariables, mapVariables: MapVariables) {
  // 人员切换图表和关键事件跟随切换

  watch(
    () => mapVariables.activePilotId,
    (value) => {
      // 切换人员关键事件
      if (mapVariables.mapOption?.keyEvent) findEvent(value)
    }
  )

  // 获取关键事件
  const getEvents = () => {
    if (!mapVariables.mapOption?.keyEvent) return
    variables.pilotList?.forEach((item: { pilotId: number }) => {
      getEventList(item.pilotId)
    })
  }

  let allEventList = [] as KeyEvent[]
  const getEventList = async (pilotId: number) => {
    await queryKeyEvent({
      flightTaskId: variables.taskId,
      politId: pilotId
    }).then((res: any[]) => {
      // 时间轴标记
      let duration = mapVariables.endTime - mapVariables.startTime
      let timelineMark = res.map((item) => {
        let left =
          ((item.eventStartTime - mapVariables.startTime) / duration) * 100
        let width = Math.abs(
          ((item.eventEndTime - item.eventStartTime) / duration) * 100
        )
        return {
          width,
          left,
          title: item.eventName,
          eventSource: item.eventSource,
          id: item.id,
          color: `rgba(${Math.random() * 255},${Math.random() * 255},${
            Math.random() * 255
          },1)`
        }
      })

      // 事件
      let eventData = res.map((item: KeyEventRes) => item)

      let keyEventData = allEventList.find((item) => item.pilotId === pilotId)
      // 新增或修改关键事件表
      if (keyEventData) {
        keyEventData.eventData = eventData
        keyEventData.timelineMark = timelineMark
      } else {
        allEventList.push({
          pilotId,
          eventData: eventData,
          timelineMark
        })
      }
    })
  }

  let eventSource = ''
  const eventListUpdate = async (
    pilotId: number,
    type: string,
    update: boolean, // 是否更新列表
    eventChecked: string[]
  ) => {
    eventSource = type
    update && (await getEventList(pilotId))
    findEvent(pilotId, eventChecked)
  }

  const findEvent = (value: number, eventChecked: string[] = []) => {
    let pilotEvent = allEventList.find((item) => item.pilotId === value)

    variables.timelineMark =
      pilotEvent?.timelineMark.filter(
        (item: any) =>
          item.eventSource == eventSource && eventChecked.includes(item.id)
      ) || []

    variables.keyEventList =
      pilotEvent?.eventData.filter(
        (item: any) => item.eventSource == eventSource
      ) || []
  }

  return { getEvents, eventListUpdate }
}
