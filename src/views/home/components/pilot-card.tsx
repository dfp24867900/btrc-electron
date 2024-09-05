import { defineComponent, PropType, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { usePilot } from '../use-pilot'
import { NSpin } from 'naive-ui'
import StackBarChart from '@/components/chart/modules/stackBar'
import Card from '@/components/card'
import Styles from '../home.module.scss'
const props = {
  title: {
    type: String as PropType<string>,
    default: ''
  }
}

const PilotCard = defineComponent({
  name: 'PilotCard',
  props,
  emits: ['chartClick'],
  setup(props, ctx) {
    const router = useRouter()
    const { getPilot, chartVariables } = usePilot()
    getPilot()
    const clickChart = (data: any) => {
      ctx.emit('chartClick', data.name + data.seriesName)
    }

    return {
      ...toRefs(chartVariables),
      clickChart
    }
  },
  render() {
    const { title } = this

    return (
      <Card title={title} class={[Styles.speedCard]}>
        {{
          default: () =>
            this.xAxis.length > 0 && this.yAxis.length > 0 ? (
              <StackBarChart
                height={'100%'}
                xAxisData={this.xAxis}
                seriesData={this.yAxis}
                callback={this.clickChart}
              />
            ) : (
              <NSpin
                show={this.chartLoadingRef}
                class={[Styles.spin_wh]}
              ></NSpin>
            )
        }}
      </Card>
    )
  }
})

export default PilotCard
