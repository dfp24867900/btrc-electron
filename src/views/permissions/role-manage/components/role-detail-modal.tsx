import { defineComponent, PropType, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NInput, NForm, NFormItem, useMessage } from 'naive-ui'
import { useRoleDetail } from './use-role-detail'
import Modal from '@/components/modal'
import type { IRecord } from '../types'
import { MAX_LENGTH_LIMIT } from '@/common/length-limit'

const props = {
  show: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  currentRecord: {
    type: Object as PropType<IRecord | null>,
    default: {}
  }
}

export const RoleModal = defineComponent({
  name: 'role-modal',
  props,
  emits: ['cancel', 'update'],
  setup(props, ctx) {
    const { t } = useI18n()
    const Message = useMessage()
    const { state, formRules, onReset, onSave, onSetValues } = useRoleDetail()
    const onCancel = () => {
      onReset()
      ctx.emit('cancel')
    }
    const onConfirm = async () => {
      const result = await onSave(props.currentRecord?.id)
      if (!result) {
        Message.error('非法操作，请提示正确输入')
        return
      }
      onCancel()
      ctx.emit('update')
    }

    watch(
      () => props.show,
      () => {
        if (props.show && props.currentRecord?.id) {
          onSetValues(props.currentRecord)
        }
      }
    )

    return {
      t,
      ...toRefs(state),
      formRules,
      onCancel,
      onConfirm
    }
  },
  render(props: { currentRecord: IRecord }) {
    const { t } = this
    const { currentRecord } = props
    return (
      <Modal
        show={this.show}
        title={`${currentRecord?.id ? '编辑角色' : '创建角色'}`}
        onCancel={this.onCancel}
        confirmLoading={this.loading}
        onConfirm={this.onConfirm}
        confirmClassName='btn-submit'
        cancelClassName='btn-cancel'
      >
        <NForm
          ref='formRef'
          model={this.formData}
          rules={this.formRules}
          labelPlacement='left'
          labelAlign='left'
          labelWidth={80}
        >
          <NFormItem label={'角色名'} path='roleName'>
            <NInput
              class='input-username'
              v-model:value={this.formData.roleName}
              placeholder={'请输入角色名称'}
              maxlength={MAX_LENGTH_LIMIT.text}
            />
          </NFormItem>
          <NFormItem label={'描述'} path='description'>
            <NInput
              type={'textarea'}
              v-model:value={this.formData.description}
              placeholder={'请输入描述'}
              maxlength={MAX_LENGTH_LIMIT.textarea}
            />
          </NFormItem>
        </NForm>
      </Modal>
    )
  }
})

export default RoleModal
