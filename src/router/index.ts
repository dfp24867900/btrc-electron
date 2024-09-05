import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router';
import routes from './routes';
import { useUserStore } from '@/store/user/user';
import { UserInfoRes } from '@/service/modules/users/types';
import _ from 'lodash';

// NProgress
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const router = createRouter({
  history: createWebHistory(import.meta.env.MODE === 'production' ? '/' : '/'),
  routes
});

interface metaData {
  title?: string;
  activeMenu?: string;
  showSide?: boolean;
  auth?: Array<string>;
}

const flatRoute = _.flatMapDeep(routes, (item) => item.children || item);

let hasRoute: (to: RouteLocationNormalized) => boolean = (
  to: RouteLocationNormalized
) => {
  return flatRoute.findIndex((item) => item?.name === to.name) !== -1;
};

/**
 * Routing to intercept
 */
router.beforeEach(
  async (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    NProgress.start();
    const userStore = useUserStore();
    const metaData: metaData = to.meta;

    if (to.name === 'login') {
      next();
    } else {
      if (
        ((userStore.getUserInfo as UserInfoRes).userType === 'ADMIN_USER' ||
          userStore.getUserAuth.includes(String(metaData.activeMenu))) &&
        hasRoute(to)
      ) {
        next();
      } else if ((userStore.getUserInfo as UserInfoRes).id) {
        next({ name: 'home' });
      } else {
        next({ name: 'login' });
      }
    }

    NProgress.done();
  }
);

router.afterEach(() => {
  NProgress.done();
});

export default router;
