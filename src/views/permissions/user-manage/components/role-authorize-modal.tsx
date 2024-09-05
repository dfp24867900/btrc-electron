import {
  defineComponent,
  PropType,
  ref,
  watch,
  Ref,
  reactive,
  computed
} from 'vue'
import { useI18n } from 'vue-i18n'
import { NSpace, NTransfer } from 'naive-ui'
import Modal from '@/components/modal'
import type { IRecord } from '../types'
import {
  queryAuthList,
  queryAuthHasList,
  updateAuthList_new
} from '@/service/modules/permissions'

interface IOption {
  value: number | string
  label: string
}

const props = {
  show: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  currentRecord: {
    type: Object as PropType<IRecord | null>
  },
  type: {
    type: String as PropType<string>,
    default: ''
  },
  allList: {
    type: Object as PropType<any>,
    default: {}
  }
}

export const RoleModal = defineComponent({
  name: 'role-modal',
  props,
  emits: ['cancel', 'update'],

  setup(props, ctx) {
    const t = useI18n()
    //监听权限类型
    const modelType = computed(() => props.type)
    const variablesAuthList = reactive({
      loading: false,
      listRef: ref([]) as Ref<IOption[]>, // 所有
      activeRef: ref([]) as Ref<(number | string)[]> // 选中
    })

    const onCancel = () => {
      ctx.emit('cancel')
    }
    const onConfirm = () => {
      //调后端接口
      var type = props.type == 'roleAuthorize' ? 'role' : 'group'
      updateAuthList_new('user', props.currentRecord?.id, type, {
        updateTo: variablesAuthList.activeRef.join(',')
      }).then((res: any) => {
        ctx.emit('update')
      })

      onCancel()
      variablesAuthList.loading = false
    }
    //监听弹窗的状态
    watch(
      () => props.show,
      async (value) => {
        if (value) {
          await queryAuthList(
            props.type == 'roleAuthorize' ? 'role' : 'group'
          ).then((res: any) => {
            variablesAuthList.listRef = res.map(
              (item: { id: number; roleName?: string; groupName?: string }) => {
                return {
                  value: item.id,
                  label:
                    props.type == 'roleAuthorize'
                      ? item.roleName
                      : item.groupName
                }
              }
            )
          })
          await queryAuthHasList(
            'user',
            props.currentRecord?.id,
            props.type == 'roleAuthorize' ? 'roles' : 'groups'
          ).then((res: any) => {
            variablesAuthList.activeRef = res.map((item: { id: number }) => {
              return item.id
            })
          })
        } else {
          variablesAuthList.listRef = []
          variablesAuthList.activeRef = []
        }
      }
    )

    return {
      t,
      onCancel,
      onConfirm,
      modelType,
      variablesAuthList
    }
  },
  render() {
    return (
      <Modal
        show={this.show}
        title={`${this.modelType === 'roleAuthorize' ? '角色' : '用户组'}`}
        onCancel={this.onCancel}
        confirmLoading={this.variablesAuthList.loading}
        onConfirm={this.onConfirm}
        confirmClassName='btn-submit'
        cancelClassName='btn-cancel'
      >
        <NSpace vertical>
          <NTransfer
            v-model:value={this.variablesAuthList.activeRef}
            virtualScroll
            options={this.variablesAuthList.listRef}
            filterable
          ></NTransfer>
        </NSpace>
      </Modal>
    )
  }
})

export default RoleModal
