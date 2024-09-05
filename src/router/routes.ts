import type { RouteRecordRaw } from 'vue-router';
import type { Component } from 'vue';
import permissions from './modules/permissions';
import gis from './modules/gis';
import utils from '@/utils';

// All TSX files under the views folder automatically generate mapping relationship
const modules = import.meta.glob('/src/views/**/**.tsx');
const components: { [key: string]: Component } = utils.mapping(modules);

let pages: RouteRecordRaw[] = [gis];
/**
 * Basic page
 */
const basePage: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'login' },
    meta: { title: '首页' },
    component: () => import('@/layouts/content'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: components['home'],
        meta: {
          title: '首页',
          activeMenu: 'home',
          showSide: true,
          auth: []
        }
      },
      {
        path: '/password',
        name: 'password',
        component: components['password'],
        meta: {
          title: '修改密码',
          activeMenu: 'password',
          auth: []
        }
      },
      {
        path: '/profile',
        name: 'profile',
        component: components['profile'],
        meta: {
          title: '用户信息',
          activeMenu: 'profile',
          auth: []
        }
      }
    ]
  },
  permissions, // 权限中心
  ...pages
];

/**
 * Login page
 */
const loginPage: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: components['login'],
    meta: {
      title: '登录',
      activeMenu: 'login',
      auth: []
    }
  }
];

const routes: RouteRecordRaw[] = [...basePage, ...loginPage];

// 重新组织后导出
export default routes;
