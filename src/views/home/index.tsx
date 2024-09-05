import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NGrid, NGi } from 'naive-ui';
import { getStatistics } from '@/service/modules/home';
import type { StatisticsRes } from '@/service/modules/home/types';
import RadarCard from './components/radar-card';
import DefinitionCard from './components/pilot-card';
import Styles from './home.module.scss';
import type docSharePublish from './components/radar-card';

import Map from '@/views/map';

export default defineComponent({
  name: 'home',
  setup() {
    const router = useRouter();

    const radarCard = ref<InstanceType<typeof docSharePublish>>();

    const homeVariables = reactive({
      pilotNo: ref(''),
      flightTaskNo: ref(''),
      beltNo: ref(''),
      mattressFileNo: ref('')
    });
    const onChartClick = (value: string) => {
      radarCard.value && radarCard.value.updateRadar(value);
    };

    onMounted(() => {
      getStatistics().then((res: StatisticsRes) => {
        homeVariables.pilotNo = res.pilotNo;
        homeVariables.flightTaskNo = res.flightTaskNo;
        homeVariables.beltNo = res.beltNo;
        homeVariables.mattressFileNo = res.mattressFileNo;
      });
    });

    return {
      radarCard,
      homeVariables,
      router,
      onChartClick
    };
  },
  render() {
    return (
      <>
        {/* <div style="height:100%;background-color:#ccc">首页</div> */}
        <div style={{ height: '100%' }}>
          <div class={[Styles.top_content]} style={{ height: '22%' }}>
            <div class={[Styles.top_1]}>
              <a href="javascript:;" style={{ textDecoration: 'none' }}>
                <p>
                  {this.homeVariables.pilotNo || '-'}
                  <span>人</span>
                </p>
                <p>飞行员</p>
              </a>
            </div>
            <div class={[Styles.top_2]}>
              <a href="javascript:;" style={{ textDecoration: 'none' }}>
                <p>
                  {this.homeVariables.flightTaskNo || '-'}
                  <span>组</span>
                </p>
                <p>飞行数据</p>
              </a>
            </div>
            <div class={[Styles.top_3]}>
              <p>
                {this.homeVariables.beltNo || '-'}
                <span>组</span>
              </p>
              <p>生理数据</p>
            </div>
          </div>
          <NGrid cols={24} class={[Styles.middleAndBottom_content]}>
            <NGi span={24}>
              <DefinitionCard
                onChartClick={this.onChartClick}
                title={'飞行员战斗应激度'}
              />
            </NGi>
          </NGrid>
          <NGrid cols={24} xGap={12} class={[Styles.middleAndBottom_content]}>
            <NGi span={24}>
              <RadarCard ref="radarCard"></RadarCard>
            </NGi>
          </NGrid>
        </div>
      </>
    );
  }
});
