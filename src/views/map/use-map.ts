import { onMounted, onUnmounted, reactive, provide, SetupContext } from 'vue'
import * as Cesium from 'cesium'
import _ from 'lodash'
import { getBasicDatas, getGisFiles } from '@/service/modules/animation'
import { useCesium } from './cesium'
import { getProperty } from './get-property'
import { useClockSocket } from './clock-socket'
import { useDropdown } from './use-dropdowm'
import { useTimeline } from './use-timeline'
import { useKeyEvent } from './use-keyEvent'
import { usePhysiological } from './use-physiological'
import { useSetting } from './use-setting'
import utils from '@/utils'
import type { IVariables, PilotsRes, MapOption } from './types'
import type { ClockMessageType } from './cesium/types'

let viewer: Cesium.Viewer | null = null
export function useMap(
  taskId: string,
  batchId: string,
  mapOption: MapOption,
  ctx: SetupContext<'returnTask'[]>
) {
  const variables = reactive({
    collapsedRef: true,
    taskName: '',
    taskId: taskId,
    batchId: batchId,
    pilotList: [],
    keyEventList: [],
    timelineMark: []
  } as IVariables)

  // 地图设置
  const { mapSetting, settingUpdate } = useSetting(mapOption)

  const {
    mapVariables,
    initPlaybackMap,
    thirdPerson,
    initTimeLine,
    addPropertys,
    changeSceneMode,
    controlAnimate,
    trackedEntityChange
  } = useCesium(mapOption, mapSetting)

  // 加载位置数据
  const { initTrackSocket, getModelPath, sendTrackMessage, getTaskJson } =
    getProperty(mapVariables, addPropertys, initTimeLine)

  // 锁定模型切换
  const operationCamera = (planeId: string, pilotId: number) => {
    mapVariables.activePilotId = pilotId
    trackedEntityChange(planeId)
  }

  const activeModelChange = (planeId: string, pilotId: number) => {
    operationCamera(planeId, pilotId)
    sendSyncMessage('view')
  }

  // 同步
  const { connectClocksync, sendSyncMessage } = useClockSocket(
    mapVariables,
    operationCamera,
    sendTrackMessage
  )

  // 关键事件
  const { getEvents, eventListUpdate } = useKeyEvent(variables, mapVariables)

  // 生理图表
  const { physiological, physiologicalListChange } = usePhysiological()

  // 时钟、倍速修改、时间跳转
  const operationClock = (type: ClockMessageType, time?: number) => {
    controlAnimate(type, time)
    sendSyncMessage(type, time)
  }

  const gotoTime = (data: { time: number }) => {
    sendTrackMessage('TIMESTAMP', String(data.time))
    operationClock('gotoTime', data.time)
  }

  // 时间轴/倍速操作
  const { keydown } = useTimeline(
    mapVariables.mapOption?.timeline,
    gotoTime,
    operationClock
  )

  // 右键菜单
  const { dropdown, meunStateChange, handleClickoutside } = useDropdown(
    mapVariables.mapOption?.changeViewMode
  )

  // 选择菜单
  const dropdownSelect = async (value: string) => {
    dropdown.showDropdown = false
    switch (value) {
      case 'thirdPerson':
        thirdPerson()
        break
      case '2D':
        changeSceneMode(2)
        break
      case '3D':
        changeSceneMode(3)
        break
    }
  }

  const animateData = reactive({
    shouldAnimate: false,
    time: 0,
    clockMultiplier: 1
  })
  provide('AnimateData', animateData)

  const animationUpdate = _.throttle(
    (scene: Cesium.Scene, time: Cesium.JulianDate) => {
      animateData.time = Cesium.JulianDate.toDate(time).getTime()
      animateData.shouldAnimate = viewer?.clock.shouldAnimate || false
      animateData.clockMultiplier = viewer?.clock.multiplier || 1
    },
    200
  )

  const clocksync = _.throttle(
    (scene: Cesium.Scene, time: Cesium.JulianDate) => {
      sendSyncMessage('realtime', Cesium.JulianDate.toDate(time).getTime())
    },
    200
  )

  // 加载任务数据
  const initTask = async () => {
    mapVariables.loadingRef = true
    try {
      let gisDataSN = ''
      await getBasicDatas(
        { taskId: variables.taskId },
        mapOption.basicURL
      ).then(async (res: any) => {
        // 任务名称
        variables.taskName = res.taskName
        mapVariables.startTime = res.taskStartTime
        mapVariables.endTime = res.taskEndTime
        gisDataSN = res.gisDataSN

        // 生理数据选择列表
        physiological.physiologicalOption = res.allQueryIndexs?.map(
          (item: string) => item
        )

        // 人员列表
        variables.pilotList = res.pilots?.map((item: PilotsRes) => {
          return {
            pilotId: Number(item.pilotId),
            pilotName: item.pilotName,
            planeId: item.fjid
          }
        })
      })

      if (!gisDataSN) {
        window.$message.error('注册失败')
        throw '注册失败'
      }

      let fileList: string[] = []
      // 获取文件路径
      await getGisFiles({ gisDataSN: gisDataSN }).then((res: any) => {
        fileList = res
      })

      // 获取模型地址
      await getModelPath()
      // 获取位置信息
      if (fileList.length > 0) {
        // json文件模式
        getTaskJson(fileList)
      } else {
        // websocket模式
        gisDataSN && initTrackSocket(gisDataSN, utils.batchId())
      }

      // 时间同步websocket
      connectClocksync(variables.batchId)

      ctx.emit('returnTask', {
        taskName: variables.taskName,
        pilotList: variables.pilotList
      })

      // 获取关键事件
      getEvents()
    } catch (e) {
      console.log(e)
      mapVariables.loadingRef = false
    }
  }

  onMounted(() => {
    viewer = initPlaybackMap('cesiumContainer', 'map_content')
    viewer?.scene.postUpdate.addEventListener(animationUpdate)
    viewer?.scene.postUpdate.addEventListener(clocksync)
    initTask()
  })

  onUnmounted(() => {
    viewer?.scene.postUpdate.removeEventListener(animationUpdate)
    viewer?.scene.postUpdate.removeEventListener(clocksync)
    window.viewer = null
  })

  return {
    physiological,
    variables,
    mapVariables,
    animateData,
    dropdown,
    handleClickoutside,
    gotoTime,
    initTask,
    meunStateChange,
    keydown,
    dropdownSelect,
    physiologicalListChange,
    activeModelChange,
    operationClock,
    eventListUpdate,
    mapSetting,
    settingUpdate
  }
}
