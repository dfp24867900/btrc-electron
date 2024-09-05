import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { pick } from 'lodash'
import {
  createKeyEvent,
  updateKeyEvent,
  keyEventTarget,
  computeTarget,
  computFlight
} from '@/service/modules/animation'
import utils from '@/utils'
import type { IRecord, KeyEventReq } from './types'

interface Physiology {
  name: string
  dataValue: string
  type?: string
}

interface PhysiologyGroup {
  type: string
  list: Physiology[]
}

export function useKeyEvent(activePilotId: number) {
  const route = useRoute()

  const initialValues = {
    eventName: '',
    eventSource: '手动创建',
    eventType: null,
    eventStartTime: null,
    eventEndTime: null,
    flightIntensity: '未计算',
    flightDifficulty: '未计算',
    indexComputeId: null
  } as KeyEventReq

  const state = reactive({
    formRef: ref(),
    formData: { ...initialValues },
    taskId: ref(String(route.params.taskId)),
    activePilotId: activePilotId,
    eventId: null as null | number,
    saving: false,
    noStress: false,
    computing: false,
    physiology: [] as PhysiologyGroup[]
  })

  const eventSourceList = [
    {
      label: '手动创建',
      value: '手动创建'
    },
    {
      label: '自动创建',
      value: '自动创建'
    }
  ]

  const eventTypeList = [
    {
      label: '飞行参数',
      value: '飞行参数'
    },
    {
      label: '腰带监测数据',
      value: '腰带监测数据'
    },
    {
      label: '床垫监测数据',
      value: '床垫监测数据'
    }
  ]

  const formRules = {
    eventName: {
      trigger: ['input', 'blur'],
      required: true,
      validator(validator: any, value: string) {
        if (!value.trim()) {
          return new Error('请输入关键事件名称')
        }
      }
    },
    eventSource: {
      trigger: ['input', 'blur'],
      required: true,
      validator(validator: any, value: string) {
        if (!value) {
          return new Error('请选择关键事件来源')
        }
      }
    },
    eventType: {
      trigger: ['input', 'blur'],
      required: true,
      validator(validator: any, value: string) {
        if (!value) {
          return new Error('请输入关键事件类型')
        }
      }
    },
    eventStartTime: {
      trigger: ['input', 'blur'],
      required: true,
      validator(validator: any, value: number | Date) {
        if (!value) {
          return new Error('请选择关键事件开始时间')
        }
      }
    },
    eventEndTime: {
      trigger: ['input', 'blur'],
      required: true,
      validator(validator: any, value: number | Date) {
        if (!value) {
          return new Error('请选择关键事件结束时间')
        }
      }
    }
  }

  const onReset = () => {
    state.formData = { ...initialValues }
  }

  // 计算飞行指标
  const computFlightIndex = async () => {
    if (state.noStress) return false
    state.noStress = true
    await computFlight({
      taskId: state.taskId,
      pilotId: state.activePilotId,
      eventStartTime: state.formData.eventStartTime || 0,
      eventEndTime: state.formData.eventEndTime || 0
    })
      .then((res: { fxqd: number; fxnd: number }) => {
        if (res) {
          state.formData.flightIntensity = res.fxqd.toFixed(0)
          state.formData.flightDifficulty = res.fxnd.toFixed(0)
        }
        state.noStress = false
      })
      .catch(() => {
        state.noStress = false
      })
  }

  // 计算身体指标
  const compute = async () => {
    if (state.computing) return false
    state.computing = true

    try {
      let indexComputeId = utils.batchId()

      state.formData.indexComputeId = indexComputeId
      await computeTarget({
        taskId: state.taskId,
        pilotId: state.activePilotId,
        computeId: indexComputeId,
        eventStartTime: state.formData.eventStartTime || 0,
        eventEndTime: state.formData.eventEndTime || 0
      }).then((res: any) => {
        state.physiology = []

        state.physiology = physiologyGroup(res)
      })
      state.computing = false
    } catch {
      state.computing = false
    }
  }

  const onSave = async (
    taskId: string,
    politId: number,
    eventId: number | undefined
  ): Promise<boolean> => {
    try {
      await state.formRef.validate()
      if (state.saving) return false
      state.saving = true

      // 计算身体指标
      await computFlightIndex()
      // 计算身体指标
      !state.formData.indexComputeId && (await compute())

      let params = {
        eventName: state.formData.eventName,
        eventSource: state.formData.eventSource,
        eventType: state.formData.eventType,
        eventStartTime: state.formData.eventStartTime,
        eventEndTime: state.formData.eventEndTime,
        flightTaskId: taskId,
        politId: politId,
        indexComputeId: state.formData.indexComputeId
      }

      eventId
        ? await updateKeyEvent({ eventId, ...params })
        : await createKeyEvent(params).then((res: any) => {
            state.eventId = res.event_id
          })

      await keyEventTarget({
        eventId: state.eventId,
        flightIntensity: state.formData.flightIntensity,
        flightDifficulty: state.formData.flightDifficulty
      })

      state.saving = false
      return true
    } catch (err) {
      state.saving = false
      return false
    }
  }

  const physiologyGroup = (data: any) => {
    let physiologyList = [] as {
      type: string
      list: Physiology[]
    }[]
    data.forEach((a: any) => {
      let findPhysiology = physiologyList.find((b) => {
        return a.type === b.type
      })
      if (!findPhysiology) {
        physiologyList.push({
          type: a.type,
          list: [{ name: a.name, dataValue: a.dataValue }]
        })
      } else {
        findPhysiology.list.push({ name: a.name, dataValue: a.dataValue })
      }
    })
    return physiologyList
  }

  const onSetValues = (record: IRecord) => {
    state.formData = {
      ...pick(record, [
        'eventName',
        'eventSource',
        'eventType',
        'eventStartTime',
        'eventEndTime',
        'flightDifficulty',
        'flightIntensity'
      ])
    } as KeyEventReq
    state.eventId = record.id
    state.physiology = physiologyGroup(record.allIndex)
  }

  return {
    state,
    formRules,
    eventSourceList,
    eventTypeList,
    onReset,
    onSave,
    onSetValues,
    compute,
    computFlightIndex
  }
}
