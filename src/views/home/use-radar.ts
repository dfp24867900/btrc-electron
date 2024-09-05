import { ref, reactive } from 'vue';
export function useRadar() {
  const chartVariables = reactive({
    chartLoadingRef: ref(false),
    radarData: [] as Array<any>,
    seriesData: [] as Array<{ name: string; value: number[] }>,
    clickValue: ''
  });
  const getRadar = async (data?: string) => {
    // if (chartVariables.chartLoadingRef) return
    // chartVariables.chartLoadingRef = true
    chartVariables.clickValue = data || '';
    chartVariables.seriesData = [];
    chartVariables.radarData = [];
    //调接口
    chartVariables.radarData = [
      {
        indicator: [
          { name: '', max: 100 },
          { name: '', max: 100 },
          { name: '', max: 100 },
          { name: '', max: 100 },
          { name: '', max: 100 },
          { name: '', max: 100 }
        ],
        center: ['15%', '50%'],
        radius: '70%'
      },
      {
        indicator: [
          { name: '', max: 100 },
          { name: '', max: 100 },
          { name: '', max: 100 },
          { name: '', max: 100 },
          { name: '', max: 100 }
        ],
        radius: '70%',
        center: ['50%', '50%']
      },
      {
        indicator: [
          { name: '', max: 100 },
          { name: '', max: 100 },
          { name: '', max: 100 },
          { name: '', max: 100 },
          { name: '', max: 100 }
        ],
        radius: '70%',
        center: ['85%', '50%']
      }
    ];

    chartVariables.seriesData = [
      {
        value: [80, 70, 65, 85, 92, 64],
        name: '战斗应激度'
      },
      {
        value: [65, 83, 75, 83, 59, 67],
        name: '生理应激度'
      },
      {
        value: [82, 93, 83, 76, 82, 91],
        name: '心理应激度'
      }
    ];

    if (chartVariables.clickValue == '张明2023-2-7') {
      chartVariables.seriesData = [
        {
          value: [66, 72, 10, 20, 16, 18],
          name: '战斗应激度'
        },
        {
          value: [90, 100, 66, 77, 42, 21],
          name: '生理应激度'
        },
        {
          value: [99, 14, 28, 26, 42, 21],
          name: '心理应激度'
        }
      ];
    }
  };

  const updateRadar = (data?: string) => {
    getRadar(data);
  };
  return { getRadar, chartVariables, updateRadar };
}
