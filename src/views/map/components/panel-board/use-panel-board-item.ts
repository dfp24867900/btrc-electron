import { onMounted, reactive, inject, watch } from 'vue'
import { useMessage } from 'naive-ui'
import * as Cesium from 'cesium'
import { getPilotStress } from '@/service/modules/animation'
import type { AnimateData, Pilot } from './types'
import imgUrl from './heiwa.jpg'

export function usePanel(taskId: string, data: Pilot) {
  const message = useMessage()

  const variables = reactive({
    checkboxList: [],
    person: {
      name: data.pilotName,
      headPath: imgUrl, // 头像地址
      stress: '0',
      extremePointValue: 30,
      maxPointValue: 68,
      minPointValue: -1,
      desc: '你愁啥，赶紧关上'
    },
    redValue: 0
  })

  const animateData: AnimateData = inject('AnimateData') || {
    shouldAnimate: false,
    time: 0
  }

  watch(
    () => animateData.time,
    () => {
      let julianDate = Cesium.JulianDate.fromDate(new Date(animateData.time))
      let stress: number = stressPeoperty.getValue(julianDate)

      if (!stress) return
      // 计算应激度字体颜色
      if (stress > variables.person.extremePointValue) {
        variables.redValue =
          255 *
          (Math.abs(stress - variables.person.extremePointValue) /
            (variables.person.maxPointValue -
              variables.person.extremePointValue))
      } else {
        variables.redValue =
          255 *
          (Math.abs(variables.person.extremePointValue - stress) /
            (variables.person.extremePointValue -
              variables.person.minPointValue))
      }

      if (
        stress >= variables.person.maxPointValue ||
        stress <= variables.person.minPointValue
      ) {
        variables.redValue = 255
      }

      variables.person.stress = stress.toFixed(2)
    }
  )

  const stressPeoperty = new Cesium.SampledProperty(Number)
  const addLabel = (data: any, property: Cesium.SampledProperty) => {
    data.forEach((item: any) => {
      let time = Cesium.JulianDate.fromDate(new Date(item.timeVal))
      property.addSample(time, Number(item.data))
    })
  }

  //获取数据
  const queryLabelData = async () => {
    try {
      await getPilotStress({
        taskId: taskId,
        pilotId: data.pilotId
      }).then((res: any) => {
        variables.person.extremePointValue = res.extremePointValue
        variables.person.maxPointValue = res.maxPointValue
        variables.person.minPointValue = res.minPointValue
        addLabel(res.lineData, stressPeoperty)
      })
    } catch {
      message.warning(`${variables.person.name}无应激度数据`)
    }
  }

  onMounted(() => {
    queryLabelData()
  })

  return {
    variables
  }
}
