import { defineComponent, computed, ref, nextTick, provide } from 'vue';
import {
  zhCN,
  enUS,
  dateZhCN,
  dateEnUS,
  NConfigProvider,
  darkTheme,
  GlobalThemeOverrides,
  NMessageProvider,
  NDialogProvider
} from 'naive-ui';
import { useThemeStore } from '@/store/theme/theme';
import { useLocalesStore } from '@/store/locales/locales';
import themeList from '@/themes';

const App = defineComponent({
  name: 'App',
  setup() {
    const isRouterAlive = ref(true);
    const themeStore = useThemeStore();
    const currentTheme = computed(() =>
      themeStore.darkTheme ? darkTheme : undefined
    );
    const localesStore = useLocalesStore();
    /*refresh page when router params change*/
    const reload = () => {
      isRouterAlive.value = false;
      nextTick(() => {
        isRouterAlive.value = true;
      });
    };

    provide('reload', reload);

    return {
      reload,
      isRouterAlive,
      currentTheme,
      localesStore
    };
  },
  render() {
    const themeOverrides: GlobalThemeOverrides =
      themeList[this.currentTheme ? 'dark' : 'light'];

    return (
      <NConfigProvider
        theme={this.currentTheme}
        theme-overrides={themeOverrides}
        style={{ width: '100%', height: '100vh' }}
        date-locale={
          String(this.localesStore.getLocales) === 'zh_CN' ? dateZhCN : dateEnUS
        }
        locale={String(this.localesStore.getLocales) === 'zh_CN' ? zhCN : enUS}
      >
        <NMessageProvider>
          <NDialogProvider>
            {this.isRouterAlive ? <router-view /> : ''}
          </NDialogProvider>
        </NMessageProvider>
      </NConfigProvider>
    );
  }
});

export default App;
