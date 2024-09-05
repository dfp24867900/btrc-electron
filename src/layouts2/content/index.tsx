import { defineComponent, onMounted, watch, toRefs, ref, nextTick } from 'vue';
import {
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  useMessage,
  NBackTop
} from 'naive-ui';
import NavBar from './components/navbar';
import SideBar from './components/sidebar';
import TitleBar from './components/title-bar';
import { useDataList } from './use-dataList';
import { useLocalesStore } from '@/store/locales/locales';
import { useRouteStore } from '@/store/route/route';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const Content = defineComponent({
  name: 'DSContent',
  setup() {
    window.$message = useMessage();
    const route = useRoute();
    const { locale } = useI18n();
    const localesStore = useLocalesStore();
    const routeStore = useRouteStore();

    const {
      state,
      changeMenuOption,
      changeHeaderMenuOptions,
      changeUserDropdown
    } = useDataList();
    const sideKeyRef = ref();
    onMounted(() => {
      locale.value = localesStore.getLocales;
      changeMenuOption(state);
      changeHeaderMenuOptions(state);
      getSideMenu(state);
      changeUserDropdown(state);
    });
    const getSideMenu = async (state: any) => {
      await nextTick();
      const key: string = String(route.meta.activeMenu);
      let menus = state.menuOptions;
      if (['projects', 'resource', 'monitor', 'security'].includes(key)) {
        menus =
          state.menuOptions.filter(
            (menu: { key: string }) => menu.key === 'dispatch'
          )[0].children || state.menuOptions;
      }
      if (
        [
          'data-excavate',
          'excavate-work',
          'data-dataAccess',
          'data-systemComponents',
          'excavate-datasource'
        ].includes(key)
      ) {
        menus =
          state.menuOptions.filter(
            (menu: { key: string }) => menu.key === 'excavate'
          )[0].children || state.menuOptions;
      }
      state.sideMenuOptions =
        menus.filter((menu: { key: string }) => menu.key === key)[0]
          ?.children || state.menuOptions;
      state.isShowSide = route.meta.showSide;
    };

    watch(useI18n().locale, () => {
      changeMenuOption(state);
      changeHeaderMenuOptions(state);
      getSideMenu(state);
      changeUserDropdown(state);
    });

    watch(
      () => route.path,
      () => {
        if (route.path !== '/login') {
          routeStore.setLastRoute(route.path);
          state.isShowSide = route.meta.showSide as boolean;

          if (route.matched[1]?.path === '/projects/:projectCode') {
            changeMenuOption(state);
          }

          getSideMenu(state);

          const currentSide = (
            route.meta.activeSide
              ? route.meta.activeSide
              : route.matched[1]?.path
          ) as string;
          sideKeyRef.value = currentSide?.includes(':projectCode')
            ? currentSide.replace(
                ':projectCode',
                route.params.projectCode as string
              )
            : currentSide;
        }
      },
      { immediate: true }
    );

    return {
      ...toRefs(state),
      changeMenuOption,
      sideKeyRef
    };
  },
  render() {
    return (
      <NLayout style="height: 100%">
        {/* <TitleBar></TitleBar> */}
        <NLayoutHeader style={'height:65px'}>
          <NavBar
            class="tab-horizontal"
            headerMenuOptions={this.headerMenuOptions}
            localesOptions={this.localesOptions}
            timezoneOptions={this.timezoneOptions}
            userDropdownOptions={this.userDropdownOptions}
          />
        </NLayoutHeader>
        <NLayout has-sider position="absolute" style={'top: 65px'}>
          {this.isShowSide && (
            <SideBar
              sideMenuOptions={this.sideMenuOptions}
              sideKey={this.sideKeyRef}
            />
          )}
          <NLayoutContent
            native-scrollbar={false}
            style={'padding: 16px 22px'}
            contentStyle={'height: 100%'}
          >
            <NBackTop></NBackTop>
            <router-view key={this.$route.fullPath} />
          </NLayoutContent>
        </NLayout>
      </NLayout>
    );
  }
});

export default Content;
