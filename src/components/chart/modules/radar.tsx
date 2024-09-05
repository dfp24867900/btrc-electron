import { defineComponent, PropType, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import { throttle } from 'echarts'
import type { ECharts } from 'echarts'
const props = {
  height: {
    type: [String, Number] as PropType<string | number>,
    default: 400
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: '100%'
  },
  radarData: {
    type: Array as PropType<any>,
    default: () => []
  },
  seriesData: {
    type: Array as PropType<Array<any>>,
    default: () => []
  },
  callback: {
    type: Function as PropType<(data: any) => void>,
    default: (data: any) => {}
  }
}
const RadarCharts = defineComponent({
  name: 'RadarCharts',
  props,
  setup(props) {
    let chestDom: HTMLElement | null
    let chart: ECharts | null = null
    const initChart = async () => {
      await nextTick()
      chestDom = document.getElementById('radarChartsRef')
      if (chestDom) {
        chart?.dispose()
        chart = null
        chart = echarts.init(chestDom)
        if (chart) {
          let option = initOption()
          chart.setOption(option, true)
          addEventListener('resize', resize)
        }
      }
    }
    const resize = throttle(() => {
      chart && chart.resize()
    }, 20)
    const initOption = () => {
      const series: {
        type: string
        radarIndex: number
        areaStyle: {}
        tooltip: { trigger: string }
        data: { value: number[]; name: string }[]
      }[] = []
      props.seriesData.map((item, index) => {
        series.push({
          type: 'radar',
          tooltip: {
            trigger: 'item'
          },
          areaStyle: {},
          radarIndex: index,
          data: [
            {
              value: item.value,
              name: item.name
            }
          ]
        })
      })
      const option = {
        title: [
          {
            subtext: '战斗应激度雷达图',
            left: '15%',
            top: '85%',
            textAlign: 'center',
            subtextStyle: {
              fontSize: '16px'
            }
          },
          {
            subtext: '生理应激度雷达图',
            left: '50%',
            top: '85%',
            textAlign: 'center',
            subtextStyle: {
              fontSize: '16px'
            }
          },
          {
            subtext: '心理应激度雷达图',
            left: '85%',
            top: '85%',
            textAlign: 'center',
            subtextStyle: {
              fontSize: '16px'
            }
          }
        ],
        legend: {
          left: 'center',
          top: '2px',
          textStyle: {
            color: '#6e7079'
          }
        },
        tooltip: {
          axisPointer: {
            type: 'shadow'
          }
        },
        radar: props.radarData,
        series: series
      }
      return option
    }

    watch(
      () => props.seriesData,
      () => {
        let option = initOption()
        chart && chart.setOption(option, true)
      },
      { deep: true }
    )
    initChart()
  },
  render() {
    const { height, width } = this
    return (
      <div
        ref='radarChartsRef'
        id='radarChartsRef'
        style={{
          height: typeof height === 'number' ? height + 'px' : height,
          width: typeof width === 'number' ? width + 'px' : width
        }}
      />
    )
  }
})
export default RadarCharts
