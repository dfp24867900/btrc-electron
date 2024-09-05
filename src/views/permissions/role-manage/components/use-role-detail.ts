import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { pick } from 'lodash'
import { createRole, updateRole } from '@/service/modules/permissions'
import type { IRecord, RoleReq } from '../types'

export function useRoleDetail() {
  const { t } = useI18n()
  const initialValues = {
    roleName: '',
    description: ''
  } as RoleReq

  let PREV_NAME: string

  const state = reactive({
    formRef: ref(),
    formData: { ...initialValues },
    saving: false,
    loading: false
  })

  const formRules = {
    roleName: {
      trigger: ['input', 'blur'],
      required: true,
      validator(validator: any, value: string) {
        if (!value.trim()) {
          return new Error('请输入角色名称')
        }
      }
    }
  }

  const onReset = () => {
    state.formData = { ...initialValues }
  }
  const onSave = async (id?: number): Promise<boolean> => {
    try {
      await state.formRef.validate()
      if (state.saving) return false
      state.saving = true
      id
        ? await updateRole({ id, ...state.formData })
        : await createRole(state.formData)

      state.saving = false
      return true
    } catch (err) {
      state.saving = false
      return false
    }
  }
  const onSetValues = (record: IRecord) => {
    state.formData = {
      ...pick(record, ['roleName', 'description'])
    } as RoleReq
    PREV_NAME = state.formData.roleName
  }

  return { state, formRules, onReset, onSave, onSetValues }
}
