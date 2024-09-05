import { reactive, h } from 'vue';
import { NEllipsis, NIcon, NTooltip } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import {
  HomeOutlined,
  // ProfileOutlined,
  UserOutlined,
  LogoutOutlined
  // UsergroupDeleteOutlined,
  // UserDeleteOutlined
  // BankOutlined,
  // ContactsOutlined,
  // UsbOutlined,
  // UsbTwotone,
  // ProjectOutlined,
  // IdcardOutlined,
  // FlagOutlined,
  // CodeSandboxOutlined,
  // SkinOutlined
} from '@vicons/antd';
// import { Usb } from '@vicons/fa';
import { useUserStore } from '@/store/user/user';
import { timezoneList } from '@/common/timezone';
import type { UserInfoRes } from '@/service/modules/users/types';

const projectId = Number(import.meta.env.VITE_APP_PROJECT);
export function useDataList() {
  const { t } = useI18n();
  const userStore = useUserStore();

  const renderIcon = (icon: any) => {
    return () => h(NIcon, null, { default: () => h(icon) });
  };

  const renderTooltipIcon = (label: string, icon: any) => {
    return () =>
      h(NTooltip, null, {
        default: () => label,
        trigger: renderIcon(icon)
      });
  };

  const localesOptions = [
    {
      label: 'English',
      key: 'en_US'
    },
    {
      label: '中文',
      key: 'zh_CN'
    }
  ];

  const timezoneOptions = () =>
    timezoneList.map((item) => ({ label: item, value: item }));

  const state = reactive({
    isShowSide: false,
    localesOptions,
    timezoneOptions: timezoneOptions(),
    userDropdownOptions: [],
    menuOptions: [],
    headerMenuOptions: [],
    sideMenuOptions: []
  });

  const changeMenuOption = (state: any) => {
    state.menuOptions = [
      // 首页
      {
        label: () => h(NEllipsis, null, { default: () => t('menu.home') }),
        key: 'home',
        name: 'home',
        icon: renderTooltipIcon(t('menu.home'), HomeOutlined),
        projects: [1, 2, 3, 4]
      },
      {
        label: () => h(NEllipsis, null, { default: () => '回放' }),
        key: 'gis',
        name: 'gis',
        icon: renderTooltipIcon('回放', HomeOutlined),
        projects: [1, 2, 3, 4]
      }

      // 航医
      // 人员管理
      // {
      //   label: () => h(NEllipsis, null, { default: () => '人员管理' }),
      //   key: 'pilot-manage',
      //   name: `pilot-manage`,
      //   icon: renderTooltipIcon('人员管理', IdcardOutlined),
      //   children: [
      //     {
      //       label: '人员信息',
      //       key: '/pilot-manage/pilot',
      //       name: `pilot-manage-pilot`,
      //       icon: renderIcon(IdcardOutlined)
      //     },
      //     {
      //       label: '单位信息',
      //       key: '/pilot-manage/company',
      //       name: `pilot-manage-company`,
      //       icon: renderIcon(BankOutlined)
      //     }
      //   ],
      //   projects: [1, 2]
      // },
      // // 设备管理
      // {
      //   label: () => h(NEllipsis, null, { default: () => '设备管理' }),
      //   key: 'device-manage',
      //   name: `device-manage`,
      //   icon: renderTooltipIcon('设备管理', Usb),
      //   children: [
      //     {
      //       label: '设备穿戴',
      //       key: '/device-manage/connect-personnel',
      //       name: `device-manage-connect-personnel`,
      //       icon: renderIcon(SkinOutlined)
      //     },
      //     {
      //       label: '设备类型',
      //       key: '/device-manage/type',
      //       name: `device-manage-type`,
      //       icon: renderIcon(UsbOutlined)
      //     },
      //     {
      //       label: '设备信息',
      //       key: '/device-manage/detail',
      //       name: `device-manage-detail`,
      //       icon: renderIcon(UsbTwotone)
      //     },
      //     {
      //       label: '采集箱管理',
      //       key: '/device-manage/collection-box',
      //       name: `device-manage-collection-box`,
      //       icon: renderIcon(CodeSandboxOutlined)
      //     }
      //   ],
      //   projects: [1, 2]
      // },
      // // 任务管理
      // {
      //   label: () => h(NEllipsis, null, { default: () => '任务管理' }),
      //   key: 'task-manage',
      //   name: `task-manage`,
      //   icon: renderTooltipIcon('任务管理', ProfileOutlined),
      //   children: [
      //     {
      //       label: '任务信息',
      //       key: '/task-manage/task-info',
      //       name: `task-manage-task-info`,
      //       icon: renderIcon(ProjectOutlined)
      //     },
      //     {
      //       label: '任务人员信息',
      //       key: '/task-manage/task-personnel-info',
      //       name: 'task-manage-task-personnel-info',
      //       icon: renderIcon(ContactsOutlined)
      //     },
      //     {
      //       label: '飞行数据',
      //       key: '/task-manage/acmi-task',
      //       name: `task-manage-acmi-task`,
      //       icon: renderIcon(FlagOutlined)
      //     }
      //   ],
      //   projects: [1, 2]
      // },

      // 权限管理
      // {
      //   label: () => h(NEllipsis, null, { default: () => '权限中心' }),
      //   key: 'permissions',
      //   name: `permissions`,
      //   icon: renderTooltipIcon('权限中心', UserOutlined),
      //   children: [
      //     {
      //       label: '用户管理',
      //       key: '/permissions/users-manage',
      //       name: `permissions-users-manage`,
      //       icon: renderIcon(UserOutlined)
      //     },
      //     {
      //       label: '用户组管理',
      //       key: '/permissions/usergroup-manage',
      //       name: `permissions-usergroup-manage`,
      //       icon: renderIcon(UsergroupDeleteOutlined)
      //     },
      //     {
      //       label: '角色管理',
      //       key: '/permissions/role-manage',
      //       name: `permissions-role-manage`,
      //       icon: renderIcon(UserDeleteOutlined)
      //     }
      //   ],
      //   projects: [1, 2, 3, 4]
      // }
    ];

    if ((userStore.getUserInfo as UserInfoRes).userType !== 'ADMIN_USER') {
      state.menuOptions = state.menuOptions.filter(
        (firstMenu: {
          name: string;
          type: string;
          children: { name: string; children: { name: string }[] }[];
        }) => {
          // 二级菜单筛选
          if (firstMenu.type === 'secondNav') {
            firstMenu.children = firstMenu.children?.filter(
              (secondaryMenu: {
                name: string;
                children: { name: string }[];
              }) => {
                return userStore.getUserAuth.some((item: string) => {
                  return item === secondaryMenu.name;
                });
              }
            );
          }
          return userStore.getUserAuth.some((item: string) => {
            return (
              item === firstMenu.name ||
              (firstMenu.type === 'secondNav' && firstMenu.children.length > 0)
            );
          });
        }
      );
    }
  };

  const changeHeaderMenuOptions = (state: any) => {
    state.menuOptions.forEach(
      (item: {
        label: string;
        key: string;
        icon: any;
        type: string;
        children: any[];
        projects: number[];
      }) => {
        if (!item.projects.includes(projectId)) return;
        if (item.type === 'secondNav') {
          state.headerMenuOptions.push({
            label: item.label,
            key: item.key,
            icon: item.icon,
            children: item.children?.map((b) => ({
              label: b.label,
              key: b.key,
              icon: b.icon
            }))
          });
        } else {
          state.headerMenuOptions.push({
            label: item.label,
            key: item.key,
            icon: item.icon
          });
        }
      }
    );
  };

  const changeUserDropdown = (state: any) => {
    state.userDropdownOptions = [
      {
        label: t('user_dropdown.profile'),
        key: 'profile',
        icon: renderIcon(UserOutlined)
      },
      // {
      //   label: t('user_dropdown.password'),
      //   key: 'password',
      //   icon: renderIcon(KeyOutlined)
      // },
      {
        label: t('user_dropdown.logout'),
        key: 'logout',
        icon: renderIcon(LogoutOutlined)
      }
    ];
  };

  return {
    state,
    changeHeaderMenuOptions,
    changeMenuOption,
    changeUserDropdown
  };
}
