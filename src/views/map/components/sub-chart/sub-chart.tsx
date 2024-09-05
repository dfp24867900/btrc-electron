import { defineComponent, ref, PropType, watch, nextTick } from 'vue'
import { useCharts } from './use-charts'

const props = {
  show: {
    type: Boolean as PropType<boolean>,
    default: false
  }
}

const SubChart = defineComponent({
  name: 'SubChart',
  props,
  setup(props, ctx) {
    const subRef = ref()
    const { getChartData, timeChange, resize, pilotChange } = useCharts(subRef)

    watch(
      () => props.show,
      () => {
        nextTick(() => {
          subRef.value.style.display = props.show ? 'block' : 'none'
        })
      },
      {
        immediate: true
      }
    )

    return {
      subRef,
      getChartData,
      timeChange,
      resize,
      pilotChange
    }
  },
  render() {
    return (
      <div
        ref='subRef'
        onContextmenu={(event) => {
          event.preventDefault()
        }}
      />
    )
  }
})

export default SubChart
