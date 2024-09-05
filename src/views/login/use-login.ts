import { Ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/service/modules/login';
import { getUserInfo } from '@/service/modules/permissions';
import { useUserStore } from '@/store/user/user';
import type { Router } from 'vue-router';
import type { SessionIdRes } from '@/service/modules/login/types';
import type { UserInfoRes, userAuthRes } from '@/service/modules/users/types';
import { useRouteStore } from '@/store/route/route';
import { useTimezoneStore } from '@/store/timezone/timezone';

export function useLogin(state: any, loading: Ref<boolean>) {
  const router: Router = useRouter();
  const userStore = useUserStore();
  const routeStore = useRouteStore();
  const timezoneStore = useTimezoneStore();

  const handleLogin = () => {
    state.loginFormRef.validate(async (valid: any) => {
      if (!valid) {
        loading.value = true;
        try {
          const loginRes: SessionIdRes = await login({ ...state.loginForm });
          await userStore.setSessionId(loginRes.sessionId);

          // const userInfoRes: UserInfoRes = await getUserInfo()
          // await userStore.setUserInfo(userInfoRes)

          const userInfoRes: { user: UserInfoRes; menus: userAuthRes[] } =
            await getUserInfo();
          await userStore.setUserInfo(userInfoRes.user);
          const menus = userInfoRes.menus.map((item: userAuthRes) => {
            return item.keyWord;
          });
          await userStore.setUserAuth(menus);

          // const timezone = userInfoRes.userInfo.timeZone ? userInfoRes.userInfo.timeZone : 'UTC'
          // await timezoneStore.setTimezone(timezone)

          // const path = routeStore.lastRoute
          const path = 'home';
          loading.value = false;

          router.push({ path: path || 'home' });
        } catch {
          loading.value = false;
          window.$message.error('登陆失败');
        }
      }
    });
  };

  return {
    handleLogin
  };
}
