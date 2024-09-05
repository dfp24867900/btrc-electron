import type { Component } from 'vue'
import utils from '@/utils'

// All TSX files under the views folder automatically generate mapping relationship
const modules = import.meta.glob('/src/views/**/**.tsx')
const components: { [key: string]: Component } = utils.mapping(modules)
export default {
  path: '/permissions',
  name: 'permissions',
  meta: { title: '权限管理' },
  redirect: { name: 'users-manage' },
  component: () => import('@/layouts/content'),
  children: [
    {
      path: '/permissions/users-manage',
      name: 'users-manage',
      component: components['permissions-user-manage'],
      meta: {
        title: '用户管理',
        activeMenu: 'permissions',
        showSide: true,
        auth: ['ADMIN_USER']
      }
    },
    {
      // path: '/permissions/permissions-all/:id/:name/:type',
      path: '/permissions/permissions-all',
      name: 'permissions-all',
      component: components['permissions-permissions-all'],
      meta: {
        title: '设置权限',
        activeMenu: 'permissions',
        showSide: false,
        auth: ['ADMIN_USER']
      }
    },
    {
      path: '/permissions/usergroup-manage',
      name: 'usergroup-manage',
      component: components['permissions-usergroup-manage'],
      meta: {
        title: '用户组管理',
        activeMenu: 'permissions',
        showSide: true,
        auth: ['ADMIN_USER']
      }
    },
    {
      path: '/permissions/role-manage',
      name: 'role-manage',
      component: components['permissions-role-manage'],
      meta: {
        title: '角色管理',
        activeMenu: 'permissions',
        showSide: true,
        auth: ['ADMIN_USER']
      }
    }
  ]
}
