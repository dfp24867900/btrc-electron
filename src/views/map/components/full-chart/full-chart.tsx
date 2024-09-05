import { defineComponent, ref, PropType, watch, nextTick, onMounted } from 'vue'
import { useCharts } from './use-charts'
import { Pilot } from '../../types'
import Styles from './index.module.scss'

const props = {
  taskId: {
    type: String as PropType<string>,
    default: ''
  },
  pilotList: {
    type: Array as PropType<Pilot[]>,
    default: []
  },
  activePilotId: {
    type: Number as PropType<number>,
    default: 0
  }
}

const FullChart = defineComponent({
  name: 'BeltCard',
  props,
  emits: ['gotoTime'],
  setup(props, ctx) {
    const fullRef = ref()
    const { physiological, getChartData, resize, chartListChange } = useCharts(
      ctx,
      fullRef
    )

    onMounted(() => {
      const pilotIdList = props.pilotList?.map((item) => item.pilotId)
      getChartData(props.taskId, pilotIdList)
    })

    watch(
      () => props.activePilotId,
      (value) => {
        physiological.fullChartShow = !!value
        chartListChange(value, physiological.fullChartList)
      }
    )

    watch(
      () => physiological.fullChartList,
      () => {
        nextTick(() => {
          chartListChange(props.activePilotId, physiological.fullChartList)
        })
      }
    )

    return {
      fullRef,
      physiological,
      getChartData,
      resize,
      chartListChange
    }
  },

  render(props: { chartLenght: number }) {
    return (
      this.physiological.fullChartShow && (
        <div
          ref='fullRef'
          onContextmenu={(event) => {
            event.preventDefault()
          }}
          class={[Styles.container]}
          style={{
            height: `${this.physiological.fullChartList.length * 50}px`
          }}
        />
      )
    )
  }
})

export default FullChart
