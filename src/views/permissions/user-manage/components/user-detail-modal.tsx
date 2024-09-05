import { defineComponent, PropType, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NInput, NForm, NFormItem, useMessage } from 'naive-ui'
import { useUserDetail } from './use-user-detail'
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
  name: 'user-modal',
  props,
  emits: ['cancel', 'update'],
  setup(props, ctx) {
    const { t } = useI18n()
    const Message = useMessage()
    const { state, IS_ADMIN, formRules, onReset, onSetValues, onSave } =
      useUserDetail()
    const onCancel = () => {
      onReset()
      ctx.emit('cancel')
    }
    const onConfirm = async () => {
      const result = await onSave(props.currentRecord?.id)
      if (!result) {
        Message.error('非法操作，请按提示正确输入')
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
      IS_ADMIN,
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
        title={`${t(
          currentRecord?.id
            ? 'security.user.edit_user'
            : 'security.user.create_user'
        )}`}
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
          <NFormItem label={t('security.user.username')} path='userName'>
            <NInput
              class='input-username'
              v-model:value={this.formData.userName}
              minlength={3}
              maxlength={39}
              placeholder={t('security.user.username_tips')}
            />
          </NFormItem>

          <NFormItem
            label={t('security.user.user_password')}
            path='userPassword'
          >
            <NInput
              class='input-password'
              type='password'
              v-model:value={this.formData.userPassword}
              placeholder={t('security.user.user_password_tips')}
              maxlength={MAX_LENGTH_LIMIT.password}
              input-props={{ autocomplete: 'new-password' }}
            />
          </NFormItem>
          {/* 确认密码 */}
          <NFormItem label='确认密码' path='fixUserPassword'>
            <NInput
              class='input-repassword'
              type='password'
              v-model:value={this.formData.fixUserPassword}
              placeholder={t('security.user.user_password_tips')}
              maxlength={MAX_LENGTH_LIMIT.password}
              input-props={{ autocomplete: 'new-password' }}
            />
          </NFormItem>
          <NFormItem label={t('security.user.email')} path='email'>
            <NInput
              class='input-email'
              v-model:value={this.formData.email}
              placeholder={t('security.user.email_empty_tips')}
              maxlength={MAX_LENGTH_LIMIT.text}
            />
          </NFormItem>
          <NFormItem label={t('security.user.phone')} path='phone'>
            <NInput
              class='input-phone'
              v-model:value={this.formData.phone}
              placeholder={t('security.user.phone_empty_tips')}
              maxlength={MAX_LENGTH_LIMIT.phone}
            />
          </NFormItem>
        </NForm>
      </Modal>
    )
  }
})

export default UserModal
