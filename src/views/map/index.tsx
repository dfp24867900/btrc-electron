import { defineComponent, PropType, renderSlot } from 'vue'
import {
  NDropdown,
  NSpin,
  NLayout,
  NLayoutSider,
  NLayoutContent
} from 'naive-ui'
import { useMap } from './use-map'
import Dials from './components/dials/dials'
import ClockSpeed from './components/clock-speed/clock-speed'
import OrderList from './components/order-list-old/order-list'
import PanelBoard from './components/panel-board/panel-board'
import ClockControl from './components/clock-control/clock-control'
import TimelineMark from './components/timeline-mark/timeline-mark'
import TimelineSchedule from './components/timeline-schedule/timeline-schedule'
import FullChart from './components/full-chart/full-chart'
import MapSetting from './components/map-setting'
import KeyEvent from './components/key-event/key-event'
import { MapOption } from './cesium/types'
import Styles from './index.module.scss'

const props = {
  taskId: {
    type: String as PropType<string>,
    default: null
  },
  batchId: {
    type: String as PropType<string>,
    default: null
  },
  mapOption: {
    type: Object as PropType<MapOption>,
    default: {}
  }
}

export default defineComponent({
  name: 'map-content',
  props,
  emits: ['returnTask'],
  setup(props, ctx) {
    const {
      physiological,
      variables,
      mapVariables,
      animateData,
      dropdown,
      handleClickoutside,
      gotoTime,
      meunStateChange,
      dropdownSelect,
      physiologicalListChange,
      activeModelChange,
      operationClock,
      eventListUpdate,
      mapSetting,
      settingUpdate
    } = useMap(props.taskId, props.batchId, props.mapOption, ctx)

    // 人员卡片点击
    const planeChange = (planeId: string, pilotId: number) => {
      activeModelChange(planeId, pilotId)
    }

    // 更新关键事件列表
    const updateEventList = (
      type: string,
      update: boolean = false,
      eventChecked: string[]
    ) => {
      eventListUpdate(mapVariables.activePilotId, type, update, eventChecked)
    }

    return {
      physiological,
      variables,
      mapVariables,
      animateData,
      dropdown,
      gotoTime,
      handleClickoutside,
      dropdownSelect,
      meunStateChange,
      operationClock,
      planeChange,
      physiologicalListChange,
      eventListUpdate,
      mapSetting,
      settingUpdate,
      updateEventList
    }
  },
  render() {
    const { $slots } = this
    return (
      <NLayout has-sider style={'height:100%'}>
        {this.mapOption.keyEvent && (
          <NLayoutSider
            width={400}
            collapsed={this.variables.collapsedRef}
            onCollapse={() => (this.variables.collapsedRef = true)}
            onExpand={() => (this.variables.collapsedRef = false)}
            show-trigger='bar'
            collapse-mode='width'
            collapsedWidth={0}
            style={'height:100%'}
          >
            <KeyEvent
              taskId={this.variables.taskId}
              keyEventList={this.variables.keyEventList}
              activePilotId={this.mapVariables.activePilotId}
              pilotList={this.variables.pilotList}
              onGotoTime={this.gotoTime}
              onListUpdate={this.updateEventList}
              style={{ height: '100%', overflow: 'hidden' }}
            ></KeyEvent>
          </NLayoutSider>
        )}
        <NLayoutContent style={{ height: '100%' }}>
          <NSpin
            show={this.mapVariables.loadingRef}
            class={[Styles.spinHeight]}
          >
            {this.mapVariables.mapOption?.rightClickMenu && (
              <NDropdown
                placement='bottom-start'
                trigger='manual'
                x={this.dropdown.menuX}
                y={this.dropdown.menuY}
                options={this.dropdown.option}
                show={this.dropdown.showDropdown}
                onClickoutside={this.handleClickoutside}
                onSelect={this.dropdownSelect}
              ></NDropdown>
            )}
            <div id='map_content' class={[Styles.map_content]}>
              <div
                id='cesiumContainer'
                onContextmenu={this.meunStateChange}
                onClick={this.handleClickoutside}
                style={{ height: '100%' }}
              ></div>
              {/* 时间轴加载进度 */}
              {this.mapVariables.mapOption?.progressBar && (
                <TimelineSchedule
                  timelineSchedule={this.mapVariables.timelineSchedule}
                ></TimelineSchedule>
              )}

              {/* 图表 */}
              {this.mapVariables.mapOption?.chart &&
                this.variables.pilotList.length > 0 && (
                  <FullChart
                    taskId={this.variables.taskId}
                    pilotList={this.variables.pilotList}
                    activePilotId={this.mapVariables.activePilotId}
                    onGotoTime={this.gotoTime}
                    class={[Styles.full_chart]}
                    style={{
                      bottom: this.mapVariables.mapOption.timeline
                        ? '27px'
                        : '0'
                    }}
                  ></FullChart>
                )}

              {/* 时钟/倍速 */}
              {this.mapVariables.mapOption?.clock && <ClockSpeed></ClockSpeed>}

              {/* 人员列表 */}
              {this.mapVariables.mapOption?.panelBoard && (
                <PanelBoard
                  taskId={this.variables.taskId}
                  list={this.variables.pilotList}
                  hasChart={this.mapVariables.mapOption.chart}
                  activePilotId={this.mapVariables.activePilotId}
                  selectOption={this.physiological.physiologicalOption}
                  onPlaneChange={this.planeChange}
                  onPhysiologicalChange={this.physiologicalListChange}
                ></PanelBoard>
              )}

              {/* 动画控制 */}
              {this.mapVariables.mapOption?.clockControl && (
                <ClockControl
                  shouldAnimate={this.animateData.shouldAnimate}
                  onKeydown={this.operationClock}
                  style={{
                    bottom: this.mapVariables.mapOption.timeline ? '27px' : '0'
                  }}
                ></ClockControl>
              )}

              {/* 第一人称视角组件 */}
              {this.mapVariables.mapOption?.viewingType !== 3 && (
                <Dials
                  show={this.mapVariables.isFirstPerson}
                  heading={this.mapVariables.firstPerson.heading}
                  pitch={this.mapVariables.firstPerson.pitch}
                  roll={this.mapVariables.firstPerson.roll}
                  height={this.mapVariables.firstPerson.height}
                ></Dials>
              )}

              {/* 事件列表 */}
              {this.mapVariables.mapOption?.orderlList && (
                <OrderList
                  taskId={this.variables.taskId}
                  url={this.mapOption.orderListURL}
                ></OrderList>
              )}

              {/* 时间轴标记 */}
              {this.mapVariables.mapOption?.timelimeMark && (
                <TimelineMark
                  timelineMarkList={this.variables.timelineMark}
                ></TimelineMark>
              )}

              {this.mapVariables.mapOption?.mapSetting && (
                <MapSetting
                  setting={this.mapSetting.settingOption}
                  onSettingUpdate={this.settingUpdate}
                ></MapSetting>
              )}

              {renderSlot($slots, 'default')}
            </div>
          </NSpin>
        </NLayoutContent>
      </NLayout>
    )
  }
})
