import { reactive, h, nextTick, SetupContext } from 'vue'
import { NSpace, NTooltip, NButton, NIcon } from 'naive-ui'
import { ArrowRightOutlined } from '@vicons/antd'
import { renderTableTime } from '@/common/common'
import util from '@/utils'
import type { TableColumns } from 'naive-ui/es/data-table/src/interface'
import type { IRecord } from './types'

export function useTable(
  ctx: SetupContext<('gotoTime' | 'listUpdate')[]>,
  // disabled: boolean,
  dropdownSelect: (key: string) => void
) {
  const variables = reactive({
    menuX: 0,
    menuY: 0,
    showDropdown: false,
    dropdownOption: [
      {
        label: '查看',
        key: 'edit'
      },
      {
        label: () => h('span', { style: { color: 'red' } }, '删除'),
        key: 'delete'
        // disabled: disabled
      }
    ],
    activeRow: null as any,
    listOrDetail: 'list'
  })

  const columnsRef: TableColumns<any> = [
    {
      type: 'selection',
      width: 30
    },
    {
      title: '事件名称',
      key: 'eventName',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '事件说明',
      key: 'eventType',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '开始时刻',
      key: 'eventStartTime',
      width: 80,
      ellipsis: {
        tooltip: true
      },
      render: (_row: IRecord) => util.formatTime(Number(_row.eventStartTime))
    },
    {
      title: '跳转',
      key: 'actions',
      width: 45,
      render(row: any) {
        return h(NSpace, null, {
          default: () => [
            h(
              NTooltip,
              {},
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      circle: true,
                      type: 'info',
                      size: 'small',
                      focusable: false,
                      // disabled: disabled,
                      onClick: () => {
                        ctx.emit('gotoTime', { time: row.eventStartTime })
                      }
                    },
                    {
                      icon: () =>
                        h(NIcon, null, {
                          default: () => h(ArrowRightOutlined)
                        })
                    }
                  ),

                default: () => '跳转'
              }
            )
          ]
        })
      }
    }
  ]

  const handleClickoutside = () => {
    variables.showDropdown = false
  }

  const rowProps = (row: any) => {
    return {
      onContextmenu: (e: MouseEvent) => {
        e.preventDefault()
        variables.showDropdown = false
        nextTick().then(() => {
          variables.showDropdown = true
          variables.menuX = e.clientX
          variables.menuY = e.clientY
          variables.activeRow = row
        })
      },
      ondblclick: (e: { layerX: number }) => {
        if (e.layerX < 30) return
        variables.activeRow = row
        dropdownSelect('edit')
      }
    }
  }

  return {
    variables,
    columnsRef,
    handleClickoutside,
    rowProps
  }
}
