import { defineComponent, toRefs, PropType, watch, ref } from 'vue'
import {
  NButton,
  NDataTable,
  NTooltip,
  NIcon,
  NSpace,
  NDropdown,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NDatePicker,
  NCard,
  NButtonGroup,
  useMessage,
  NScrollbar,
  NDivider,
  NSpin,
  useDialog,
  NTag
} from 'naive-ui'
import * as Cesium from 'cesium'
import {
  ArrowRightOutlined,
  FieldTimeOutlined,
  CalculatorOutlined
} from '@vicons/antd'
import { useTable } from './use-key-event-table'
import Card from '@/components/card'
import {
  deleteKeyEvent,
  queryKeyEventsTypeList
} from '@/service/modules/animation'
import { useKeyEvent } from './use-key-event'
import type { PilotOption } from './types'
import Styles from './index.module.scss'

const props = {
  taskId: {
    type: String as PropType<string>,
    default: ''
  },
  activePilotId: {
    type: Number as PropType<number>,
    default: null
  },
  pilotList: {
    type: Array as PropType<PilotOption[]>,
    default: []
  },
  keyEventList: {
    type: Array as PropType<any[]>,
    default: []
  }
}
const KeyEvent = defineComponent({
  name: 'key-event',
  props,
  emits: ['gotoTime', 'listUpdate'],
  setup(props, ctx) {
    const dialog = useDialog()
    const message = useMessage()

    const {
      state,
      formRules,
      eventSourceList,
      eventTypeList,
      onReset,
      onSave,
      onSetValues,
      compute,
      computFlightIndex
    } = useKeyEvent(props.activePilotId)

    const dropdownSelect = (key: string) => {
      variables.showDropdown = false
      if (key === 'delete') {
        if (variables.activeRow.eventSource == '自动') {
          message.warning('自动识别事件不可删除')
        } else {
          dialog.info({
            title: '删除',
            content: '删除此事件?',
            closable: false,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
              await deleteKeyEvent({ eventId: variables.activeRow.id })
              ctx.emit('listUpdate', eventType.value, true)
            }
          })
        }
      } else if (key === 'edit') {
        onSetValues(variables.activeRow)
        variables.listOrDetail = 'detail'
      }
    }

    const { variables, columnsRef, handleClickoutside, rowProps } = useTable(
      ctx,
      dropdownSelect
    )

    watch(
      () => props.activePilotId,
      (value) => {
        getKeyEventsTypeList(value)
        if (variables.listOrDetail !== 'list') return
        state.activePilotId = value
      }
    )

    // 创建
    const onAdd = () => {
      variables.listOrDetail = 'detail'
      variables.activeRow = null
      compute()
    }

    // 保存
    const onConfirm = async () => {
      const result = await onSave(
        state.taskId,
        state.activePilotId,
        variables.activeRow?.id
      )
      if (!result) return
      message.success('成功')
      ctx.emit('listUpdate', eventType.value, true)
      // 返回列表
      backList()
    }

    const backList = () => {
      variables.activeRow = null
      variables.listOrDetail = 'list'
      onReset()
    }

    const onCurrentTime = (type: 'eventEndTime' | 'eventStartTime') => {
      state.formData[type] = Cesium.JulianDate.toDate(
        window.viewer.clock.currentTime
      ).getTime()
    }

    const onGotoTime = (type: 'eventEndTime' | 'eventStartTime') => {
      ctx.emit('gotoTime', { time: state.formData[type] })
    }

    const selectOption = ref()
    const getKeyEventsTypeList = (pilotId: number) => {
      queryKeyEventsTypeList({ flightTaskId: props.taskId, pilotId }).then(
        (res: any) => {
          selectOption.value = res.map((item: { name: string }) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        }
      )
    }

    let eventType = ref()
    const eventTypeChange = (type: string) => {
      ctx.emit('listUpdate', type)
    }

    let eventCheckedList = ref()
    let rowKey = (row: any) => row.id
    const eventCheckedUpdate = (items: any) => {
      ctx.emit('listUpdate', eventType.value, false, items)
    }

    return {
      ...toRefs(state),
      formRules,
      eventSourceList,
      eventTypeList,
      ...toRefs(variables),
      columnsRef,
      onAdd,
      onConfirm,
      handleClickoutside,
      dropdownSelect,
      rowProps,
      backList,
      onGotoTime,
      onCurrentTime,
      compute,
      computFlightIndex,
      selectOption,
      eventType,
      eventTypeChange,
      eventCheckedList,
      rowKey,
      eventCheckedUpdate
    }
  },
  render(props: {
    disabled: boolean
    pilotList: PilotOption[]
    keyEventList: any[]
  }) {
    return (
      <div>
        <Card
          title={'关键事件'}
          contentStyle={' padding: 0px 0px;height:calc(( 100% - 43px ))'}
          style={{ height: 'calc(( 100% ))', border: 0 }}
          headerStyle={
            'padding: 8px 16px;font-size: 15px;border-bottom: 1px solid var(--n-border-color)'
          }
        >
          {{
            default: () => (
              <NScrollbar style={'max-height:100%'}>
                <NCard
                  bordered={false}
                  contentStyle={{ padding: '10px 15px' }}
                  style={{
                    display: this.listOrDetail === 'detail' ? 'block' : 'none'
                  }}
                >
                  <NForm
                    ref='formRef'
                    model={this.formData}
                    rules={this.formRules}
                    labelPlacement='left'
                    labelAlign='left'
                    labelWidth={80}
                    disabled={this.saving}
                    size='small'
                  >
                    <NFormItem label={'事件名'} path='eventName'>
                      <NInput
                        class='input-username'
                        v-model:value={this.formData.eventName}
                        minlength={3}
                        maxlength={39}
                        placeholder={'请输入事件名称'}
                        disabled={this.formData.eventSource == '自动'}
                      />
                    </NFormItem>
                    <NFormItem label={'飞行员'}>
                      <NSelect
                        placeholder={'请选择事件来源'}
                        style={{ width: '100%' }}
                        options={props.pilotList}
                        v-model:value={this.activePilotId}
                        labelField='pilotName'
                        valueField='pilotId'
                        disabled
                      />
                    </NFormItem>
                    {/* <NFormItem label={'来源'} path='eventSource'>
                        <NSelect
                          placeholder={'请选择事件来源'}
                          style={{ width: '100%' }}
                          options={this.eventSourceList}
                          v-model:value={this.formData.eventSource}
                          disabled
                        />
                      </NFormItem> */}
                    <NFormItem label={'类型'} path='eventType'>
                      <NSelect
                        placeholder={'请选择事件类型'}
                        style={{ width: '100%' }}
                        options={this.eventTypeList}
                        v-model:value={this.formData.eventType}
                        disabled={this.formData.eventSource == '自动'}
                      />
                    </NFormItem>
                    <NFormItem label={'开始时间'} path='eventStartTime'>
                      <NSpace justify='space-between' style={{ width: '100%' }}>
                        <NDatePicker
                          v-model:value={this.formData.eventStartTime}
                          type='datetime'
                          style={'width:195px'}
                          placeholder={'请选择事件开始时间'}
                          clearable
                          disabled={this.formData.eventSource == '自动'}
                        />
                        <NButtonGroup>
                          <NTooltip>
                            {{
                              default: () => '修改时间',
                              trigger: () => (
                                <NButton
                                  focusable={false}
                                  onClick={() =>
                                    this.onCurrentTime('eventStartTime')
                                  }
                                  disabled={this.formData.eventSource == '自动'}
                                >
                                  <NIcon size={20}>
                                    <FieldTimeOutlined />
                                  </NIcon>
                                </NButton>
                              )
                            }}
                          </NTooltip>
                          <NTooltip>
                            {{
                              default: () => '跳转',
                              trigger: () => (
                                <NButton
                                  focusable={false}
                                  disabled={!this.formData.eventStartTime}
                                  onClick={() =>
                                    this.onGotoTime('eventStartTime')
                                  }
                                >
                                  <NIcon size={20}>
                                    <ArrowRightOutlined />
                                  </NIcon>
                                </NButton>
                              )
                            }}
                          </NTooltip>
                        </NButtonGroup>
                      </NSpace>
                    </NFormItem>
                    <NFormItem label={'结束时间'} path='eventEndTime'>
                      <NSpace justify='space-between' style={{ width: '100%' }}>
                        <NDatePicker
                          v-model:value={this.formData.eventEndTime}
                          type='datetime'
                          style={'width:195px'}
                          placeholder={'请选择事件结束时间'}
                          clearable
                          disabled={this.formData.eventSource == '自动'}
                        />
                        <NButtonGroup>
                          <NTooltip>
                            {{
                              default: () => '修改时间',
                              trigger: () => (
                                <NButton
                                  focusable={false}
                                  onClick={() =>
                                    this.onCurrentTime('eventEndTime')
                                  }
                                  disabled={this.formData.eventSource == '自动'}
                                >
                                  <NIcon size={20}>
                                    <FieldTimeOutlined />
                                  </NIcon>
                                </NButton>
                              )
                            }}
                          </NTooltip>
                          <NTooltip>
                            {{
                              default: () => '跳转',
                              trigger: () => (
                                <NButton
                                  focusable={false}
                                  disabled={!this.formData.eventEndTime}
                                  onClick={() =>
                                    this.onGotoTime('eventEndTime')
                                  }
                                >
                                  <NIcon size={20}>
                                    <ArrowRightOutlined />
                                  </NIcon>
                                </NButton>
                              )
                            }}
                          </NTooltip>
                        </NButtonGroup>
                      </NSpace>
                    </NFormItem>
                    <NDivider dashed style={'font-size:14px;margin:10px 0'}>
                      <span>飞行指标</span>
                      <NDivider vertical></NDivider>
                      <NTooltip>
                        {{
                          default: () => '计算',
                          trigger: () => (
                            <NButton
                              text
                              circle
                              type='success'
                              focusable={false}
                              onClick={this.computFlightIndex}
                              disabled={
                                !this.formData.eventStartTime ||
                                !this.formData.eventEndTime
                              }
                            >
                              <NIcon size={20}>
                                <CalculatorOutlined />
                              </NIcon>
                            </NButton>
                          )
                        }}
                      </NTooltip>
                    </NDivider>
                    <NSpin show={this.noStress}>
                      <NFormItem label={'飞行强度'} path='flightIntensity'>
                        <NTag class={[Styles.tagStyle]}>
                          {this.formData.flightIntensity}
                        </NTag>
                      </NFormItem>
                      <NFormItem label={'飞行难度'} path='flightDifficulty'>
                        <NTag class={[Styles.tagStyle]}>
                          {this.formData.flightDifficulty}
                        </NTag>
                      </NFormItem>
                    </NSpin>
                    <NDivider dashed style={'font-size:14px;margin:10px 0'}>
                      <span>生理指标</span>
                      <NDivider vertical></NDivider>
                      <NTooltip>
                        {{
                          default: () => '计算',
                          trigger: () => (
                            <NButton
                              text
                              circle
                              type='success'
                              focusable={false}
                              onClick={this.compute}
                              disabled={
                                !this.formData.eventStartTime ||
                                !this.formData.eventEndTime
                              }
                            >
                              <NIcon size={20}>
                                <CalculatorOutlined />
                              </NIcon>
                            </NButton>
                          )
                        }}
                      </NTooltip>
                    </NDivider>
                    <NSpin show={this.computing}>
                      {this.physiology.map((a, i) => (
                        <Card
                          title={a.type}
                          headerStyle={
                            'font-size: 14px;padding: 8px 16px;border-bottom:1px solid var(--n-border-color)'
                          }
                          style={{
                            marginBottom:
                              this.physiology.length - 1 !== i ? '10px' : '0px'
                          }}
                        >
                          {a.list.map((b, j) => (
                            <NFormItem
                              label={b.name + '：'}
                              labelAlign='right'
                              labelWidth={120}
                              showFeedback={a.list.length - 1 !== j}
                            >
                              <NTag class={[Styles.tagStyle]}>
                                {b.dataValue}
                              </NTag>
                            </NFormItem>
                          ))}
                        </Card>
                      ))}
                    </NSpin>
                  </NForm>
                </NCard>
                <NCard
                  bordered={false}
                  contentStyle={{ padding: '0' }}
                  style={{
                    display: this.listOrDetail === 'list' ? 'block' : 'none'
                  }}
                >
                  <NDataTable
                    columns={this.columnsRef}
                    data={props.keyEventList}
                    bordered={false}
                    striped
                    size={'small'}
                    rowProps={this.rowProps}
                    checkedRowKeys={this.eventCheckedList}
                    rowKey={this.rowKey}
                    onUpdateCheckedRowKeys={this.eventCheckedUpdate}
                  ></NDataTable>
                  <NDropdown
                    placement='bottom-start'
                    trigger='manual'
                    x={this.menuX}
                    y={this.menuY}
                    options={this.dropdownOption}
                    show={this.showDropdown}
                    onClickoutside={this.handleClickoutside}
                    onSelect={this.dropdownSelect}
                  ></NDropdown>
                </NCard>
              </NScrollbar>
            ),
            'header-extra': () =>
              this.listOrDetail === 'detail' ? (
                <NSpace>
                  <NButton
                    size='small'
                    type='info'
                    onClick={this.backList}
                    focusable={false}
                  >
                    返回列表
                  </NButton>

                  <NButton
                    size='small'
                    type='info'
                    onClick={this.onConfirm}
                    focusable={false}
                    disabled={
                      this.saving ||
                      !this.activePilotId ||
                      this.noStress ||
                      this.computing
                    }
                  >
                    保存
                  </NButton>
                </NSpace>
              ) : (
                <NSpace>
                  <NSelect
                    style={{ width: '160px' }}
                    options={this.selectOption}
                    v-model:value={this.eventType}
                    onUpdateValue={this.eventTypeChange}
                    size='small'
                  />

                  <NButton
                    size='small'
                    type='info'
                    onClick={this.onAdd}
                    focusable={false}
                    disabled={!this.activePilotId}
                  >
                    {'创建'}
                  </NButton>
                </NSpace>
              )
          }}
        </Card>
      </div>
    )
  }
})

export default KeyEvent
