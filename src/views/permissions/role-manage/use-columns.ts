import { h, ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NSpace,
  NTooltip,
  NButton,
  NIcon,
  NDropdown,
  NPopconfirm
} from 'naive-ui'
import {
  EditOutlined,
  DeleteOutlined,
  UserSwitchOutlined,
  KeyOutlined
} from '@vicons/antd'
import {
  COLUMN_WIDTH_CONFIG,
  calculateTableWidth,
  DefaultTableWidth
} from '@/common/column-width-config'
import type { TableColumns, InternalRowData } from './types'
import { Router, useRouter } from 'vue-router'

export function useColumns(onCallback: Function) {
  const { t } = useI18n()
  const router: Router = useRouter()

  const columnsRef = ref({
    columns: [] as TableColumns,
    tableWidth: DefaultTableWidth
  })

  const createColumns = () => {
    const columns = [
      {
        title: '#',
        key: 'index',
        render: (rowData: InternalRowData, rowIndex: number) => rowIndex + 1,
        ...COLUMN_WIDTH_CONFIG['index']
      },
      {
        title: '角色名称',
        key: 'roleName',
        className: 'name',
        ...COLUMN_WIDTH_CONFIG['userName']
      },
      {
        title: '描述',
        key: 'description',
        className: 'name',
        ...COLUMN_WIDTH_CONFIG['description']
      },
      {
        title: t('security.user.create_time'),
        key: 'createTime',
        ...COLUMN_WIDTH_CONFIG['time']
      },
      {
        title: t('security.user.update_time'),
        key: 'updateTime',
        ...COLUMN_WIDTH_CONFIG['time']
      },
      {
        title: t('security.user.operation'),
        key: 'operation',
        ...COLUMN_WIDTH_CONFIG['operation'](4),
        render: (row: any) => {
          return h(NSpace, null, {
            default: () => [
              h(
                NDropdown,
                {
                  trigger: 'hover',
                  options: [
                    {
                      label: '用户',
                      key: 'allUser',
                      props: {
                        onClick: () => void onCallback(row, 'allUser')
                      }
                    },
                    {
                      label: '用户组',
                      key: 'uGroupAuthorize',
                      props: {
                        onClick: () => void onCallback(row, 'uGroupAuthorize')
                      }
                    }
                  ]
                },
                () =>
                  h(
                    NTooltip,
                    {
                      trigger: 'hover'
                    },
                    {
                      trigger: () =>
                        h(
                          NButton,
                          {
                            circle: true,
                            type: 'info',
                            size: 'small',
                            class: 'authorize'
                          },
                          {
                            icon: () =>
                              h(NIcon, null, () => h(UserSwitchOutlined))
                          }
                        ),
                      default: () => '分组'
                    }
                  )
              ),
              // 权限按钮
              h(
                NTooltip,
                { trigger: 'hover' },
                {
                  trigger: () =>
                    h(
                      NButton,
                      {
                        circle: true,
                        type: 'warning',
                        size: 'small',
                        class: 'authorize',
                        onClick: () => {
                          router.push({
                            name: 'permissions-all',
                            query: {
                              id: row.id,
                              name: row.groupName,
                              type: 'role'
                            }
                          })
                        }
                      },
                      {
                        icon: () => h(NIcon, null, () => h(KeyOutlined))
                      }
                    ),
                  default: () => t('security.user.authorize')
                }
              ),
              h(
                NTooltip,
                { trigger: 'hover' },
                {
                  trigger: () =>
                    h(
                      NButton,
                      {
                        circle: true,
                        type: 'info',
                        size: 'small',
                        class: 'edit',
                        onClick: () => void onCallback(row, 'edit')
                      },
                      () => h(NIcon, null, () => h(EditOutlined))
                    ),
                  default: () => t('security.user.edit')
                }
              ),
              h(
                NPopconfirm,
                {
                  onPositiveClick: () => void onCallback(row, 'delete')
                },
                {
                  trigger: () =>
                    h(
                      NTooltip,
                      {},
                      {
                        trigger: () =>
                          h(
                            NButton,
                            {
                              circle: true,
                              type: 'error',
                              size: 'small',
                              class: 'delete'
                            },
                            {
                              icon: () =>
                                h(NIcon, null, {
                                  default: () => h(DeleteOutlined)
                                })
                            }
                          ),
                        default: () => t('security.user.delete')
                      }
                    ),
                  default: () => t('security.user.delete_confirm')
                }
              )
            ]
          })
        }
      }
    ]
    columnsRef.value = {
      columns,
      tableWidth: calculateTableWidth(columns)
    }
  }

  onMounted(() => {
    createColumns()
  })

  watch(useI18n().locale, () => {
    createColumns()
  })

  return {
    columnsRef,
    createColumns
  }
}
