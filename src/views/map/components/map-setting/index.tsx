import { defineComponent, PropType, ref, reactive } from 'vue'
import {
  NButton,
  NIcon,
  NSpace,
  NCollapse,
  NCollapseItem,
  NCheckboxGroup,
  NCheckbox,
  NPopover,
  NScrollbar,
  NFormItem,
  NSwitch,
  NDivider,
  NGrid,
  NGi
} from 'naive-ui'
import { PushpinOutlined } from '@vicons/antd'
import { Setting } from '../../cesium/types'
import Styles from './index.module.scss'

const props = {
  setting: {
    type: Object as PropType<Setting>,
    default: {}
  }
}

const MapSetting = defineComponent({
  name: 'map-setting',
  props,
  emits: ['settingUpdate'],
  setup(props, ctx) {
    let variables = reactive({
      show: false
    })

    const settingUpdate = (value: any, type: string, source: string) => {
      ctx.emit('settingUpdate', value, type, source)
    }

    return {
      variables,
      settingUpdate
    }
  },

  render() {
    return (
      <div class={[Styles.container]}>
        <NPopover
          v-model={[this.variables.show, 'show']}
          placement='right'
          trigger='manual'
          displayDirective='show'
          style={{ padding: '8px 15px' }}
        >
          {{
            trigger: () => (
              <NButton
                type='warning'
                circle
                focusable={false}
                onClick={() => (this.variables.show = !this.variables.show)}
              >
                <NIcon size={20}>
                  <PushpinOutlined />
                </NIcon>
              </NButton>
            ),
            default: () => {
              return (
                <NScrollbar
                  style={{
                    width: '220px',
                    maxHeight: '70vh'
                  }}
                >
                  <NSpace vertical size={3}>
                    {Object.keys(this.setting).map(
                      (key: string, index: number) => {
                        const item = this.setting[key]
                        return (
                          item.show && (
                            <>
                              {index != 0 && item.show && (
                                <NDivider style={{ margin: 0 }}></NDivider>
                              )}
                              {!!item.children ? (
                                <div style={{ position: 'relative' }}>
                                  {item.children && (
                                    <NCollapse
                                      style={{ padding: '8px 0' }}
                                      displayDirective='show'
                                      arrowPlacement='right'
                                    >
                                      <NCollapseItem>
                                        {{
                                          header: () => item.title,
                                          default: () => (
                                            <NCheckboxGroup
                                              v-model:value={
                                                item.children!.defaultValue
                                              }
                                              onUpdateValue={(value) =>
                                                this.settingUpdate(
                                                  value,
                                                  key,
                                                  'checkbox'
                                                )
                                              }
                                            >
                                              <NGrid
                                                xGap={12}
                                                cols={2}
                                                yGap={5}
                                              >
                                                {item.children?.option.map(
                                                  (a) => (
                                                    <NGi>
                                                      <NCheckbox
                                                        value={a.value}
                                                        label={a.label}
                                                        focusable={false}
                                                      ></NCheckbox>
                                                    </NGi>
                                                  )
                                                )}
                                              </NGrid>
                                            </NCheckboxGroup>
                                          )
                                        }}
                                      </NCollapseItem>
                                    </NCollapse>
                                  )}

                                  <div
                                    style={{
                                      position: 'absolute',
                                      right: '0',
                                      top: '7px'
                                    }}
                                  >
                                    <NSwitch
                                      size='small'
                                      v-model:value={item.defaultValue}
                                      onUpdateValue={(value) =>
                                        this.settingUpdate(value, key, 'switch')
                                      }
                                    ></NSwitch>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <NFormItem
                                    label={item.title}
                                    labelPlacement='left'
                                    showFeedback={false}
                                    style={{ padding: '2px 0' }}
                                  >
                                    <NSpace
                                      justify='end'
                                      style={{ width: '100%' }}
                                    >
                                      <NSwitch
                                        size='small'
                                        v-model:value={item.defaultValue}
                                        onUpdateValue={(value) =>
                                          this.settingUpdate(
                                            value,
                                            key,
                                            'switch'
                                          )
                                        }
                                      ></NSwitch>
                                    </NSpace>
                                  </NFormItem>
                                </>
                              )}
                            </>
                          )
                        )
                      }
                    )}
                  </NSpace>
                </NScrollbar>
              )
            },
            header: () => {},
            footer: () => {}
          }}
        </NPopover>
      </div>
    )
  }
})

export default MapSetting
