import { reactive, provide } from 'vue'

export function usePhysiological() {
  const physiological = reactive({
    fullChartList: [] as string[],
    fullChartShow: false, // 展示图表
    physiologicalOption: []
  })
  provide('Physiological', physiological)

  // 生理数据列表变化
  const physiologicalListChange = (value: string[]) => {
    physiological.fullChartList = value
    physiological.fullChartShow = physiological.fullChartList.length > 0
  }

  return {
    physiological,
    physiologicalListChange
  }
}
