import { defineComponent, PropType, renderSlot, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NModal, NCard, NButton, NSpace } from 'naive-ui'
import ButtonLink from '@/components/button-link'
import styles from './index.module.scss'
import type { LinkOption } from '@/components/modal/types'

const props = {
  show: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  title: {
    type: String as PropType<string>,
    required: true
  },
  cancelText: {
    type: String as PropType<string>
  },
  cancelShow: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  confirmText: {
    type: String as PropType<string>
  },
  confirmShow: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  confirmClassName: {
    type: String as PropType<string>,
    default: ''
  },
  cancelClassName: {
    type: String as PropType<string>,
    default: ''
  },
  confirmDisabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  confirmLoading: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  autoFocus: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  headerLinks: {
    type: Object as PropType<Ref<Array<LinkOption>>>,
    default: [] as LinkOption[]
  }
}

const Modal = defineComponent({
  name: 'Modal',
  props,
  emits: ['cancel', 'confirm'],
  setup(props, ctx) {
    const { t } = useI18n()

    const onCancel = () => {
      ctx.emit('cancel')
    }

    const onConfirm = () => {
      ctx.emit('confirm')
    }

    return { t, onCancel, onConfirm }
  },
  render() {
    const { $slots, t, onCancel, onConfirm, confirmDisabled, confirmLoading } =
      this

    return (
      <NModal
        v-model={[this.show, 'show']}
        class={styles.container}
        mask-closable={false}
        auto-focus={this.autoFocus}
        closeOnEsc={false}
      >
        <NCard
          title={this.title}
          class={styles['modal-card']}
          contentStyle={{ overflowY: 'auto' }}
        >
          {{
            default: () => renderSlot($slots, 'default'),
            'header-extra': () => (
              <NSpace justify='end'>
                {this.headerLinks.value &&
                  this.headerLinks.value
                    .filter((item: any) => item.show)
                    .map((item: any) => {
                      return (
                        <ButtonLink
                          onClick={item.action}
                          disabled={item.disabled}
                        >
                          {{
                            default: () => item.text,
                            icon: () => item.icon()
                          }}
                        </ButtonLink>
                      )
                    })}
              </NSpace>
            ),
            footer: () => (
              <NSpace justify='end'>
                {this.cancelShow && (
                  <NButton
                    class={[this.cancelClassName, 'btn-cancel']}
                    quaternary
                    size='small'
                    onClick={onCancel}
                    focusable={false}
                  >
                    {this.cancelText || t('modal.cancel')}
                  </NButton>
                )}

                {/* TODO: Add left and right slots later */}
                {renderSlot($slots, 'btn-middle')}
                {this.confirmShow && (
                  <NButton
                    class={[this.confirmClassName, 'btn-submit']}
                    type='info'
                    size='small'
                    onClick={onConfirm}
                    disabled={confirmDisabled}
                    loading={confirmLoading}
                    focusable={false}
                  >
                    {this.confirmText || t('modal.confirm')}
                  </NButton>
                )}
              </NSpace>
            )
          }}
        </NCard>
      </NModal>
    )
  }
})

export default Modal
