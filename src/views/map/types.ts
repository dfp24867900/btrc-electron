interface MapOption {
  clock?: boolean // 时钟
  progressBar?: boolean // 进度条
  clockControl?: boolean // 时钟控制组件
  mapSetting?: boolean // 左侧悬浮控制按钮
  timeline?: boolean // 时间线组件
  fullscreenButton?: boolean //全屏按钮
  timelimeMark?: boolean // 时间线标记组件
  specialEffects?: boolean // 特效
  keyEvent?: boolean // 关键事件
  orderlList?: boolean // 公告板组件
  panelBoard?: boolean // 人员报告版组件
  chart?: boolean // 图表组件
  synchronousSending?: boolean // 同步发送
  synchronousReception?: boolean // 同步接收
  viewingType?: number // 视角类型：1、三种都有，2、不可切换第三视角，3、不可锁定模型和第一视角
  changeViewMode?: boolean // 2D/3D切换
  rightClickMenu?: boolean // 右键菜单
  inSync?: boolean // 同步播放按钮
  physiologySync?: boolean // 生理同步按钮
  report?: boolean // 报告
  basicURL?: string
  orderListURL?: string
}

interface Pilot {
  pilotId: number
  pilotName: string
  planeId: string
}

interface IVariables {
  collapsedRef: boolean
  taskName: string
  taskId: string
  batchId: string
  pilotList: Pilot[]
  keyEventList: any[]
  timelineMark: any[]
}

interface KeyEventRes {
  id: number
  eventName: string
  eventSource: string
  eventType: string
  eventStartTime: number
  eventEndTime: number
  allIndex: { name: string; dataValue: string }[]
  flightDifficulty: string
  flightIntensity: string
}

interface KeyEvent {
  pilotId: number
  eventData: any
  timelineMark?: any
}

interface PilotsRes {
  fjid: string
  pilotId: string
  pilotName: string
}

export { KeyEventRes, MapOption, IVariables, PilotsRes, KeyEvent, Pilot }
