import { defineComponent, PropType, ref, watch } from 'vue';
import initChart from '@/components/chart';
import type { Ref } from 'vue';
import { number } from '@intlify/core-base';
import { IDataAccessSeries } from './types';
import { color } from 'echarts';
import { StringIterator } from 'lodash';
const props = {
  height: {
    type: [String, Number] as PropType<string | number>,
    default: 400
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: '100%'
  },
  xAxisData: {
    type: Array as PropType<Array<string>>,
    default: () => []
  },
  yAxisData: {
    type: Array as PropType<Array<string>>,
    default: () => []
  },
  seriesData: {
    type: Array as PropType<any>,
    default: () => []
  },
  legendName: {
    type: Array as PropType<Array<string>>,
    default: []
  },
  callback: {
    type: Function as PropType<(data: any) => void>,
    default: (data: any) => {}
  }
};
const StackBarChart = defineComponent({
  name: 'stackBarChart',
  props,
  setup(props, ctx) {
    const stackBarRef: Ref<HTMLDivElement | null> = ref(null);
    const series: {
      name: string;
      stack: string;
      type: string;
      data: number[];
      barWidth: string;
    }[] = [];

    props.seriesData.map((item: { name: any; data: any }, index: any) => {
      series.push({
        name: item.name,
        type: 'bar',
        stack: 'one',
        data: item.data,
        barWidth: '35%'
      });
    });

    const option = {
      brush: {
        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
        xAxisIndex: 0
      },
      toolbox: {
        show: false,
        feature: {
          magicType: {
            type: ['stack']
          },
          dataView: {}
        }
      },
      tooltip: {
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: '#fff'
      },

      legend: {
        left: 'center'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '10%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: props.xAxisData,
          axisTick: {
            show: true,
            alignWithLabel: true,
            inside: true
          },
          axisLabel: {
            formatter: function (data: string) {
              return data.split(' - ')[0];
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {},
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed' //图表设置虚线网格
            }
          }
        }
      ],
      series: series
    };
    initChart(stackBarRef, option, props.callback);
    return { stackBarRef };
  },
  render() {
    const { height, width } = this;
    return (
      <div
        ref="stackBarRef"
        style={{
          height: typeof height === 'number' ? height + 'px' : height,
          width: typeof width === 'number' ? width + 'px' : width
        }}
      />
    );
  }
});
export default StackBarChart;
