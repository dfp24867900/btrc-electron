import { defineComponent, onMounted, watch, toRefs, ref, nextTick } from 'vue';
import {
  NLayout,
  NLayoutContent,
  useMessage,
  NBackTop,
  NMenu,
  NLayoutSider,
  NSpace
} from 'naive-ui';
import Theme from './components/theme';
import { useDataList } from './use-dataList';
import { useLocalesStore } from '@/store/locales/locales';
import { useRouteStore } from '@/store/route/route';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const Content = defineComponent({
  name: 'DSContent',
  setup() {
    window.$message = useMessage();
    const route = useRoute();
    const router = useRouter();
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

    const menuKey = ref(route.meta.activeMenu as string);
    watch(
      () => route.path,
      () => {
        menuKey.value = route.meta.activeMenu as string;
      }
    );

    const handleMenuClick = (key: string) => {
      router.push({ path: `/${key}` });
    };

    return {
      ...toRefs(state),
      changeMenuOption,
      sideKeyRef,
      handleMenuClick,
      menuKey
    };
  },
  render() {
    return (
      <NLayout style="height: 100%">
        <NLayout has-sider position="absolute" style={'top: 0px'}>
          {this.isShowSide && (
            <NLayoutSider
              nativeScrollbar={false}
              width={180}
              // style={{
              //   height: 'calc(100%-30px)',
              //   margin: '5px 0px 10px 10px',
              //   borderRadius: '5px'
              // }}
            >
              <NSpace vertical justify="space-between" style="height:100%">
                <NMenu
                  value={this.menuKey}
                  mode="vertical"
                  options={this.headerMenuOptions}
                  onUpdateValue={this.handleMenuClick}
                  style='height: calc(100vh - 50px)'
                />
                <Theme />
              </NSpace>
            </NLayoutSider>
          )}
          <NLayoutContent
            native-scrollbar={false}
            style={'padding: 10px;'}
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
