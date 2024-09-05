import type { Component } from 'vue';
import utils from '@/utils';

// All TSX files under the views folder automatically generate mapping relationship
const modules = import.meta.glob('/src/views/**/**.tsx');
const components: { [key: string]: Component } = utils.mapping(modules);
export default {
  path: '/gis',
  name: 'gis',
  meta: { title: '回放' },
  redirect: { name: 'gis-taskId' },
  component: () => import('@/layouts/content'),
  children: [
    {
      path: '/gis/taskId',
      name: 'gis-taskId',
      component: components['gis'],
      meta: {
        title: '回放',
        activeMenu: 'gis',
        showSide: true,
        auth: ['ADMIN_USER']
      }
    }
  ]
};
