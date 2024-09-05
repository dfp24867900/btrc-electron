import { defineComponent, PropType, toRefs } from 'vue';
import { NSpin } from 'naive-ui';
import RadarCharts from '@/components/chart/modules/radar';
import Card from '@/components/card';
import Styles from '../home.module.scss';
import { useRadar } from '../use-radar';
const props = {
  title: {
    type: String as PropType<string>,
    default: ''
  }
};
const RadarCard = defineComponent({
  name: 'radarCard',
  props,
  setup() {
    const { getRadar, updateRadar, chartVariables } = useRadar();
    getRadar(chartVariables.clickValue);
    return {
      ...toRefs(chartVariables),
      updateRadar
    };
  },
  render() {
    return (
      <Card class={[Styles.speedCard]}>
        {{
          default: () =>
            this.seriesData.length > 0 && this.radarData.length > 0 ? (
              <RadarCharts
                height={'100%'}
                seriesData={this.seriesData}
                radarData={this.radarData}
              ></RadarCharts>
            ) : (
              <NSpin
                show={this.chartLoadingRef}
                class={[Styles.spin_wh]}
              ></NSpin>
            )
        }}
      </Card>
    );
  }
});
export default RadarCard;
