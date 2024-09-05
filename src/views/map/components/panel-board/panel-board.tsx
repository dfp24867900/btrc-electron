import { defineComponent, PropType, ref } from 'vue'
import { NCollapse } from 'naive-ui'
import PanelBoardItem from './panel-board-item'
import type { Pilot } from './types'
import Styles from './index.module.scss'

const props = {
  taskId: {
    type: String as PropType<string>,
    default: ''
  },
  list: {
    type: Array as PropType<Pilot[]>,
    default: []
  },
  activePilotId: {
    type: Number as PropType<number>,
    default: 0
  },
  selectOption: {
    type: Array as PropType<string[]>,
    default: []
  },
  hasChart: {
    type: Boolean as PropType<boolean>,
    default: false
  }
}

const PanelBoard = defineComponent({
  name: 'PanelBoard',
  props,
  emits: ['planeChange', 'physiologicalChange'],
  setup(props, ctx) {
    let expandName = ref('')
    const planeChange = (
      planeId: string,
      pilotId: number,
      checkboxList: string[]
    ) => {
      ctx.emit('planeChange', planeId, pilotId)
      ctx.emit('physiologicalChange', checkboxList)
    }

    const physiologicalListChange = (value: string[]) => {
      ctx.emit('physiologicalChange', value)
    }

    return {
      expandName,
      planeChange,
      physiologicalListChange
    }
  },

  render(props: {
    list: Pilot[]
    taskId: string
    activePilotId: number
    selectOption: string[]
    hasChart: boolean
  }) {
    return (
      <NCollapse
        arrow-placement='left'
        displayDirective='show'
        accordion={true}
        expandedNames={this.expandName}
        class={[Styles.container]}
      >
        {{
          default: () => {
            return props.list.map((item) => {
              return (
                <div
                  onMouseleave={() => props.hasChart && (this.expandName = '')}
                  onMouseenter={() =>
                    props.hasChart && (this.expandName = item.pilotName)
                  }
                >
                  <PanelBoardItem
                    taskId={props.taskId}
                    data={item}
                    activePilotId={props.activePilotId}
                    selectOption={this.selectOption}
                    onPlaneChange={this.planeChange}
                    onPhysiologicalChange={this.physiologicalListChange}
                  ></PanelBoardItem>
                </div>
              )
            })
          },
          arrow: () => <div></div>
        }}
      </NCollapse>
    )
  }
})

export default PanelBoard
