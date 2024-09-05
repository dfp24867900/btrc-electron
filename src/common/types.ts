import { Component } from 'vue'

export type ITaskState =
  | 'SUBMITTED_SUCCESS'
  | 'RUNNING_EXECUTION'
  | 'READY_PAUSE'
  | 'PAUSE'
  | 'READY_STOP'
  | 'STOP'
  | 'FAILURE'
  | 'SUCCESS'
  | 'NEED_FAULT_TOLERANCE'
  | 'KILL'
  | 'WAITING_THREAD'
  | 'WAITING_DEPEND'
  | 'DELAY_EXECUTION'
  | 'FORCED_SUCCESS'
  | 'SERIAL_WAIT'
  | 'DISPATCH'
  | 'PENDING'

export type ITaskStateConfig = {
  [key in ITaskState]: {
    id: number
    desc: string
    color: string
    icon: Component
    isSpin: boolean
    classNames?: string
  }
}
