import {
  onMounted,
  onBeforeUnmount,
  nextTick,
  Ref,
  getCurrentInstance,
  inject,
  watch
} from 'vue'
import { throttle } from 'echarts'
import type { ECharts } from 'echarts'
import { getSubChartdata } from '@/service/modules/animation'

interface AllData {
  pilotId: number
  data: any
}

interface ChartDag {
  data: number[]
  startTime: number
  endTime: number
  useStartTime: number
  useEndTime: number
}

interface AnimateData {
  shouldAnimate: boolean
  time: number
  subChartShow?: boolean
}

export function useCharts(domRef: Ref<HTMLDivElement | null>) {
  const globalProperties =
    getCurrentInstance()?.appContext.config.globalProperties

  let subChart: ECharts | null = null
  const initSubChart = () => {
    let option = {
      animation: false,
      tooltip: {
        show: false,
        trigger: 'axis',
        confine: true,
        axisPointer: {
          animation: true
        }
      },
      legend: {
        height: 'auto',
        right: 2,
        top: '20%',
        itemGap: 55,
        orient: 'vertical',
        itemWidth: 8,
        textStyle: {
          fontSize: 12,
          color: '#eee'
        }
      },
      grid: [
        {
          left: 20,
          right: 70,
          height: '46%',
          top: '4%'
        },
        {
          left: 20,
          right: 70,
          height: '46%',
          top: '50%'
        }
      ],
      dataZoom: [
        {
          id: '001',
          show: true,
          type: 'inside',
          realtime: true,
          start: 0,
          end: 100,
          yAxisIndex: 0
        },
        {
          id: '002',
          type: 'inside',
          filterMode: 'none',
          xAxisIndex: [0, 1],
          zoomOnMouseWheel: false,
          moveOnMouseMove: false
        }
      ],
      xAxis: [
        {
          gridIndex: 0,
          type: 'time',
          show: false
        },
        {
          gridIndex: 1,
          type: 'time',
          show: false
        }
      ],
      yAxis: [
        {
          gridIndex: 0,
          type: 'value',
          min: 350,
          max: 650,
          show: false
        },
        {
          gridIndex: 1,
          type: 'value',
          show: false
        }
      ],
      series: [
        {
          name: 'ECG',
          type: 'line',
          xAxisIndex: 0,
          yAxisIndex: 0,
          showSymbol: false,
          color: '#1A8D1A',
          data: [],
          markLine: {
            animation: false,
            symbol: ['none', 'none'],
            label: {
              show: false,
              position: 'end',
              distance: [10, -15]
            },
            lineStyle: {
              color: '#f00',
              type: 'solid',
              width: 1
            },
            data: []
          }
        },
        {
          name: '胸呼吸',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          showSymbol: false,
          color: '#1A8DC6',
          data: [],
          markLine: {
            symbol: ['none', 'none'],
            label: {
              show: false,
              position: 'end',
              distance: [10, -15]
            },
            lineStyle: {
              color: '#f00',
              type: 'solid',
              width: 1
            },
            data: []
          }
        }
      ]
    }

    subChart?.dispose()
    subChart = globalProperties?.echarts.init(domRef.value)
    if (subChart) {
      option && subChart.setOption(option)

      subChart.getZr().on('dblclick', () => {
        if (!domRef.value) return
        let top = '20%'
        let itemGap = 55
        if (domRef.value.style.width === '80%') {
          domRef.value.style.width = '400px'
          domRef.value.style.height = '150px'
          top = '20%'
          itemGap = 55
        } else {
          domRef.value.style.width = '80%'
          domRef.value.style.height = '70%'
          top = '25%'
          itemGap = 220
        }
        subChart && subChart.setOption({ legend: { top, itemGap } })
        resize()
      })
    }
  }

  // 时间修改
  const timeChange = (time: any) => {
    let ecg = ecg_xhx_list.ecg?.find((item: ChartDag) => {
      return time >= item.useStartTime && time <= item.useEndTime
    })?.data

    let xhx = ecg_xhx_list.xhx?.find((item: ChartDag) => {
      return time >= item.useStartTime && time <= item.useEndTime
    })?.data

    if (ecg != active_ecg_xhx.ecg || xhx != active_ecg_xhx.xhx) {
      active_ecg_xhx.ecg = ecg
      active_ecg_xhx.xhx = xhx
      subChart &&
        subChart.setOption({
          series: [
            {
              name: 'ECG',
              data: active_ecg_xhx.ecg
            },
            {
              name: '胸呼吸',
              data: active_ecg_xhx.xhx
            }
          ]
        })
    }

    subChart &&
      subChart.setOption({
        dataZoom: [
          {
            id: '002',
            startValue: time - 2500,
            endValue: time + 2500
          }
        ],
        series: [
          {
            markLine: {
              data: [{ xAxis: time }]
            }
          },
          {
            markLine: {
              data: [{ xAxis: time }]
            }
          }
        ]
      })
  }

  let allDataList: AllData[] = []

  let ecg_xhx_list = {
    ecg: [] as ChartDag[],
    xhx: [] as ChartDag[]
  }
  let active_ecg_xhx = {
    ecg: [] as number[] | undefined,
    xhx: [] as number[] | undefined
  }

  const animateData: AnimateData = inject('AnimateData') || {
    shouldAnimate: false,
    time: 0
  }

  watch(
    () => animateData.time,
    (value) => {
      if (animateData.subChartShow) {
        timeChange(value)
      }
    }
  )

  const resize = throttle(async () => {
    await nextTick()
    subChart && subChart.resize()
  }, 20)

  const getChartData = (taskId: string, pilotIdList: number[]) => {
    pilotIdList.forEach((pilotId) => {
      getSubChartdata({ taskId, pilotId }).then((res) => {
        console.log(res)
        allDataList.push({
          pilotId,
          data: res
        })
        pilotChange(usePilotId)
      })
    })
  }

  // ecg和胸呼吸
  let usePilotId = 0
  const pilotChange = (pilotId: number) => {
    usePilotId = pilotId
    let pilotData = allDataList.find((item) => item.pilotId === pilotId)
    ecg_xhx_list.ecg = pilotData?.data['ECG']
    ecg_xhx_list.xhx = pilotData?.data['胸呼吸']
    timeChange(animateData.time)
  }

  onMounted(async () => {
    initSubChart()
    addEventListener('resize', resize)
  })

  onBeforeUnmount(() => {
    removeEventListener('resize', resize)
  })

  return {
    getChartData,
    timeChange,
    resize,
    pilotChange
  }
}
