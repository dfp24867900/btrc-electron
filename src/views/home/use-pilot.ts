import { ref, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
// import { getPilotCount } from '@/service/modules/home'
// import type { BarChartData, BeltRes } from '@/service/modules/home/types'

export function usePilot() {
  const route = useRoute();

  const chartVariables = reactive({
    chartLoadingRef: ref(false),
    xAxis: [] as Array<any>,
    yAxis: [] as Array<{ name: string; data: number[] }>
  });
  const getPilot = () => {
    // if (chartVariables.chartLoadingRef) return
    // chartVariables.chartLoadingRef = true
    // const { state } = useAsyncState(
    //   getPilotCount().then((res: BeltRes): BarChartData => {
    //     const xAxisData = res.flightTimeCounts.map((item) => {
    //       let grade = gradeOptions.find(
    //         (gradeOption: { label: string; value: string }) =>
    //           gradeOption.value === item.grade
    //       )
    //       if (grade) {
    //         return item.name + ' - ' + grade.label
    //       } else {
    //         return item.name
    //       }
    //     })
    //     const seriesData = res.flightTimeCounts.map((item) =>
    //       parseInt(item.flightDuration)
    //     )
    //     chartVariables.chartLoadingRef = false
    //     return { xAxisData, seriesData }
    //   }),
    //   { xAxisData: [], seriesData: [] }
    // )
    // return state
    chartVariables.xAxis = [];
    chartVariables.yAxis = [];
    //调接口
    chartVariables.yAxis = [
      { name: '2023-2-6', data: [30, 40, 20, 10, 10, 15, 30, 50] },
      { name: '2023-2-7', data: [40, 30, 20, 10, 80, 90, 30, 50] },
      { name: '2023-2-8', data: [10, 30, 20, 10, 22, 34, 30, 50] }
    ];
    chartVariables.xAxis = [
      '张明',
      '里斯',
      '李强',
      '赵小山',
      '王海青',
      '孙红雷',
      '李逸飞',
      '赵明辉'
    ];
  };

  return { getPilot, chartVariables };
}
