import { defineComponent, PropType, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NInput, NForm, NFormItem, useMessage } from 'naive-ui'
import { useUsergroupDetail } from './use-usergroup-detail'
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

export const UserModal = defineComponent({
  name: 'usergroup-modal',
  props,
  emits: ['cancel', 'update'],
  setup(props, ctx) {
    const { t } = useI18n()
    const Message = useMessage()
    const { state, formRules, onReset, onSave, onSetValues } =
      useUsergroupDetail()
    const onCancel = () => {
      onReset()
      ctx.emit('cancel')
    }
    const onConfirm = async () => {
      const result = await onSave(props.currentRecord?.id)
      if (!result) {
        Message.error('非法操作，请输入用户组名称')
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
        title={`${currentRecord?.id ? '编辑用户组' : '创建用户组'}`}
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
          <NFormItem label={'用户组名'} path='groupName'>
            <NInput
              class='input-username'
              v-model:value={this.formData.groupName}
              maxlength={MAX_LENGTH_LIMIT.text}
              placeholder={'请输入用户组名称'}
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

export default UserModal
