import { defineComponent, PropType } from 'vue'
import { usePanel } from './use-panel-board-item'
import {
  NSpace,
  NCollapseItem,
  NAvatar,
  NEllipsis,
  NCheckboxGroup,
  NGrid,
  NGi,
  NCheckbox
} from 'naive-ui'
import type { Pilot } from './types'
import Styles from './index.module.scss'

const props = {
  taskId: {
    type: String as PropType<string>,
    default: ''
  },
  data: {
    type: Object as PropType<Pilot>,
    default: null
  },
  activePilotId: {
    type: Number as PropType<number>,
    default: 0
  },
  selectOption: {
    type: Array as PropType<string[]>,
    default: []
  }
}

const PanelBoard = defineComponent({
  name: 'PanelBoard',
  props,
  emits: ['planeChange', 'physiologicalChange'],
  setup(props, ctx) {
    const { variables } = usePanel(props.taskId, props.data)

    const planeChange = () => {
      ctx.emit(
        'planeChange',
        props.data.planeId,
        props.data.pilotId,
        variables.checkboxList
      )
    }

    const checkboxChange = (value: (string | number)[]) => {
      ctx.emit('physiologicalChange', value)
    }

    return {
      variables,
      planeChange,
      checkboxChange
    }
  },

  render(props: {
    data: Pilot
    activePilotId: number
    selectOption: string[]
  }) {
    return (
      <div
        onClick={this.planeChange}
        class={[Styles.cardItem]}
        style={{
          backgroundColor:
            props.activePilotId === props.data.pilotId
              ? 'rgba(57,123,86,0.6)'
              : 'rgba(53,53,53,0.6)'
        }}
      >
        <NCollapseItem name={this.data.pilotName} class={[Styles.collapseItem]}>
          {{
            default: () => {
              return (
                <div>
                  <NSpace vertical>
                    <NCheckboxGroup
                      max={3}
                      v-model:value={this.variables.checkboxList}
                      onUpdateValue={this.checkboxChange}
                    >
                      <NGrid yGap={8} cols={2}>
                        {props.selectOption.map((item) => (
                          <NGi>
                            <NCheckbox
                              value={item}
                              focusable={false}
                              size='small'
                            >
                              {{
                                default: () => (
                                  <span class={[Styles.checkbox]}>{item}</span>
                                )
                              }}
                            </NCheckbox>
                          </NGi>
                        ))}
                      </NGrid>
                    </NCheckboxGroup>
                  </NSpace>
                </div>
              )
            },
            header: () => (
              <div class={[Styles.collapseItemHeader]}>
                <NAvatar
                  round
                  size='small'
                  src={this.variables.person.headPath}
                ></NAvatar>
                <NEllipsis class={[Styles.ellipsis]}>
                  {this.variables.person.name}
                </NEllipsis>
              </div>
            ),
            'header-extra': () => (
              <div
                class={[Styles.collapseItemHeaderExtra]}
                style={`color:${`rgb(${this.variables.redValue},255,0)`}`}
              >
                {`应激度：${this.variables.person.stress}`}
              </div>
            )
          }}
        </NCollapseItem>
      </div>
    )
  }
})

export default PanelBoard
