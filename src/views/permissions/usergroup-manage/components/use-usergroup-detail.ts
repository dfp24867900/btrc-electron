import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { pick } from 'lodash'
import {
  createUsergroup_new,
  updateUsergroup_new
} from '@/service/modules/permissions'
import type { IRecord, UsergroupReq } from '../types'

export function useUsergroupDetail() {
  const { t } = useI18n()

  const initialValues = {
    groupName: '',
    description: ''
  } as UsergroupReq

  let PREV_NAME: string

  const state = reactive({
    formRef: ref(),
    formData: { ...initialValues },
    saving: false,
    loading: false
  })

  const formRules = {
    groupName: {
      trigger: ['input', 'blur'],
      required: true,
      validator(validator: any, value: string) {
        if (!value.trim()) {
          return new Error('请输入用户组名称')
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
        ? await updateUsergroup_new({ id, ...state.formData })
        : await createUsergroup_new(state.formData)

      state.saving = false
      return true
    } catch (err) {
      state.saving = false
      return false
    }
  }
  const onSetValues = (record: IRecord) => {
    state.formData = {
      ...pick(record, ['groupName', 'description'])
    } as UsergroupReq
    PREV_NAME = state.formData.groupName
  }

  return { state, formRules, onReset, onSave, onSetValues }
}
