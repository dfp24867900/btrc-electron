import { defineComponent } from 'vue';
import Map from '@/views/map';

export default defineComponent({
  name: 'gis',
  setup() {
    let option = {
      clock: true, // 时钟
      progressBar: true, // 进度条
      clockControl: true, // 时钟控制组件
      mapSetting: true,
      timeline: true, // 时间轴组件
      fullscreenButton: true,
      timelimeMark: false, // 时间线标记组件
      orderlList: false, // 公告事件组件
      specialEffects: false, // 特效
      panelBoard: false, // 人员报告·板组件
      chart: false, // 图表组件
      synchronousSending: false, // 同步发送
      synchronousReception: false, // 同步接收
      viewingType: 1, // 视角类型
      changeViewMode: false, // 2D/3D切换
      rightClickMenu: true // 右键菜单
    };

    return {
      option
    };
  },
  render() {
    return (
      <Map
        taskId="13399318287040"
        batchId="89804513657"
        mapOption={this.option}
      ></Map>
    );
  }
});
