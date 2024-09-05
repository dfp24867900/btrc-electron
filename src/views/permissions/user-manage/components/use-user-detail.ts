import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { pick } from 'lodash';
import { useUserStore } from '@/store/user/user';
import type { IRecord, UserInfoRes } from '../types';
import { UserReq_new } from '@/service/modules/permissions/types';
import { createUser_new, updateUser_new } from '@/service/modules/permissions';

export function useUserDetail() {
  const { t } = useI18n();
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo as UserInfoRes;
  const IS_ADMIN = userInfo.userType === 'ADMIN_USER';

  const init = {
    userName: '',
    userPassword: '',
    fixUserPassword: '',
    email: '',
    phone: ''
  } as UserReq_new;

  const state = reactive({
    formRef: ref(),
    formData: { ...init },
    saving: false,
    loading: false,
    queues: [] as { label: string; value: string }[],
    tenants: [] as { label: string; value: number }[]
  });

  const formRules = {
    userName: {
      trigger: ['input', 'blur'],
      required: true,
      validator(validator: any, value: string) {
        if (!value.trim()) {
          return new Error(t('security.user.username_tips'));
        }
      }
    },
    userPassword: {
      trigger: ['input', 'blur'],
      required: true,
      validator(validator: any, value: string) {
        if (
          !value ||
          !/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]+$)[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、0-9A-Za-z]{6,22}$/.test(
            value
          )
        ) {
          return new Error(t('security.user.user_password_tips'));
        }
      }
    },
    fixUserPassword: {
      trigger: ['input', 'blur'],
      required: true,
      validator(validator: any, value: string) {
        if (!value || value != state.formData.userPassword) {
          return new Error('密码不一致');
        }
      }
    },
    tenantId: {
      trigger: ['input', 'blur'],
      required: true,
      validator(validator: any, value: string) {
        if (IS_ADMIN && !value) {
          return new Error(t('security.user.tenant_id_tips'));
        }
      }
    },
    email: {
      trigger: ['input', 'blur'],
      // required: true,
      validator(validator: any, value: string) {
        if (!value) {
          return new Error(t('security.user.email_empty_tips'));
        }
        if (
          !/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test(
            value
          )
        ) {
          return new Error(t('security.user.emial_correct_tips'));
        }
      }
    },
    phone: {
      trigger: ['input', 'blur'],
      validator(validator: any, value: string) {
        if (value && !/^1(3|4|5|6|7|8)\d{9}$/.test(value)) {
          return new Error(t('security.user.phone_correct_tips'));
        }
      }
    }
  };

  const onReset = () => {
    state.formData = { ...init };
  };

  const onSave = async (id?: number): Promise<boolean> => {
    try {
      await state.formRef.validate();
      if (state.saving) return false;
      state.saving = true;
      id
        ? await updateUser_new({ id, ...state.formData })
        : await createUser_new(state.formData);

      state.saving = false;
      return true;
    } catch (err) {
      state.saving = false;
      return false;
    }
  };

  const onSetValues = (record: IRecord) => {
    state.formData = {
      ...pick(record, ['userName', 'email', 'phone', 'state']),
      userPassword: '',
      fixUserPassword: ''
    } as UserReq_new;
  };

  return { state, formRules, IS_ADMIN, onReset, onSetValues, onSave };
}
