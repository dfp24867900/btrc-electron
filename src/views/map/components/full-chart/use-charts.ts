import {
  Ref,
  onMounted,
  onBeforeUnmount,
  SetupContext,
  getCurrentInstance,
  nextTick,
  watch,
  inject
} from 'vue'
import { throttle } from 'echarts'
import type { ECharts } from 'echarts'
import { getFullChartdata } from '@/service/modules/animation'

interface AllData {
  pilotId: number
  data: any
}

interface AnimateData {
  shouldAnimate: boolean
  time: number
}

interface PhysiologicalData {
  fullChartList: string[]
  fullChartShow: boolean
}

export function useCharts(
  ctx: SetupContext<'gotoTime'[]>,
  domRef: Ref<HTMLDivElement | null>
) {
  const globalProperties =
    getCurrentInstance()?.appContext.config.globalProperties

  const animateData: AnimateData = inject('AnimateData') || {
    shouldAnimate: false,
    time: 0
  }

  const physiological: PhysiologicalData = inject('Physiological') || {
    fullChartList: [] as string[],
    fullChartShow: false // 展示图表
  }

  // 请求心率和呼吸率
  let allDataList: AllData[] = []
  const getChartData = (taskId: string, pilotIdList: number[]) => {
    // 逐个获取人员数据
    pilotIdList.forEach((pilotId) => {
      getFullChartdata({ taskId, pilotId }).then((res: any) => {
        allDataList.push({
          pilotId,
          data: res
        })
        chartListChange(usePilotId, usechartKey)
      })
    })
  }

  watch(
    () => animateData.time,
    (value) => {
      if (physiological.fullChartShow) {
        timeChange(value)
      }
    }
  )

  let chartData: any = []
  let fullChart: ECharts | null = null
  let lineLength = 0
  const initFullChart = (dataList: any[]) => {
    let xAxis = [] as any[]
    let yAxis = [] as any[]
    let grid = [] as any[]
    let series = [] as any[]
    let xAxisIndexs = [] as number[]

    let chartHeight = 100 / dataList.length

    dataList.forEach((item: any, index: number) => {
      xAxis.push({
        gridIndex: index,
        type: 'time',
        show: false
      })
      yAxis.push({
        gridIndex: index,
        type: 'value',
        splitLine: {
          lineStyle: {
            color: '#888',
            width: 1,
            type: 'dashed'
          }
        },
        axisLabel: {
          color: '#ccc',
          margin: 5,
          fontSize: 10
        }
      })
      grid.push({
        left: 1,
        right: 30,
        top: index * chartHeight + '%',
        height: chartHeight + '%'
      })
      series.push({
        name: item.name,
        type: 'line',
        xAxisIndex: index,
        yAxisIndex: index,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1
        },
        data: item.lineData,
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
          data: [{ xAxis: animateData.time }]
        }
      })
      xAxisIndexs.push(index)
    })

    let option = {
      animation: false,
      tooltip: {
        show: true,
        trigger: 'axis',
        confine: true,
        axisPointer: {
          animation: true
        }
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: 'all'
          }
        ]
      },
      legend: {
        icon: 'none',
        right: 0,
        top: chartHeight / 2 - 5 + '%',
        itemGap: 35,
        orient: 'vertical',
        align: 'right',
        textStyle: {
          fontSize: 12,
          color: '#eee'
        }
      },
      grid: grid,
      dataZoom: [
        {
          id: '001',
          show: true,
          type: 'inside',
          realtime: true,
          start: 0,
          end: 100,
          xAxisIndex: xAxisIndexs
        }
      ],
      xAxis,
      yAxis,
      series
    }

    if (!domRef.value) return
    fullChart?.dispose()
    fullChart = globalProperties?.echarts.init(domRef.value)
    if (fullChart) {
      option && fullChart.setOption(option)
      fullChart.getZr().on('click', (params: any) => {
        if (!fullChart) return
        let pointInPixel = [params.offsetX, params.offsetY]
        let pointInGrid = fullChart.convertFromPixel('grid', pointInPixel) // 将鼠标点击位置的像素坐标转换为数据坐标系中的坐标。

        let nearestPoint = {
          distance: Number.MAX_VALUE,
          value: null
        }

        if (!option.series[0]) return
        option.series[0].data.forEach((item: any, index: number) => {
          let distance = Math.abs(item[0] - pointInGrid[0]) // 计算当前点到鼠标点击位置的距离
          if (distance < nearestPoint.distance) {
            nearestPoint.distance = distance
            nearestPoint.value = item
          }
        })

        if (nearestPoint.value) {
          ctx.emit('gotoTime', { time: nearestPoint.value[0] })
        }
      })
    }
  }

  let usePilotId = 0
  let usechartKey: string[] = []
  const chartListChange = (pilotId: number, chartKey: string[]) => {
    usePilotId = pilotId
    usechartKey = chartKey
    chartData = allDataList.find((item) => item.pilotId === pilotId)?.data || []
    let dataList: any[] = chartData?.filter((item: any) => {
      return chartKey?.includes(item.name)
    })
    lineLength = dataList.length
    initFullChart(dataList)
    resize()
  }

  // 时间修改
  const timeChange = (time: number) => {
    let series: { markLine: { data: { xAxis: number }[] } }[] = []
    for (let i = 0; i < lineLength; i++) {
      series.push({
        markLine: {
          data: [{ xAxis: time }]
        }
      })
    }
    fullChart && fullChart.setOption({ series })
  }

  const resize = throttle(async () => {
    await nextTick().then(() => {
      fullChart && fullChart.resize()
    })
  }, 20)

  onMounted(() => {
    addEventListener('resize', resize)
  })

  onBeforeUnmount(() => {
    removeEventListener('resize', resize)
  })

  return {
    physiological,
    getChartData,
    chartListChange,
    resize
  }
}
