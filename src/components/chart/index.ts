import { getCurrentInstance, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/store/theme/theme'
import { throttle } from 'echarts'
import { useI18n } from 'vue-i18n'
import type { Ref } from 'vue'
import type { ECharts } from 'echarts'
import type { ECBasicOption } from 'echarts/types/dist/shared'

function initChart<Opt extends ECBasicOption>(
  domRef: Ref<HTMLDivElement | null>,
  option: Opt,
  callback?: (data: any) => void
): ECharts | null {
  const router = useRouter()
  let chart: ECharts | null = null
  const themeStore = useThemeStore()
  const { locale } = useI18n()
  const globalProperties =
    getCurrentInstance()?.appContext.config.globalProperties

  option['backgroundColor'] = ''

  const init = () => {
    chart = globalProperties?.echarts.init(
      domRef.value,
      themeStore.darkTheme ? 'dark-bold' : ''
    )

    chart && chart.setOption(option, true, false)
    //数据资源点击事件
    if (callback) {
      chart?.on('click', (a) => {
        callback(a)
      })
    }
  }

  const resize = throttle(() => {
    chart && chart.resize()
  }, 20)

  watch(
    () => themeStore.darkTheme,
    () => {
      chart?.dispose()
      init()
    }
  )

  watch(
    () => locale.value,
    () => {
      chart?.dispose()
      init()
    }
  )

  watch(
    () => option,
    () => {
      chart?.dispose()
      init()
    },
    {
      deep: true
    }
  )

  onMounted(() => {
    init()
    addEventListener('resize', resize)
  })

  onBeforeUnmount(() => {
    removeEventListener('resize', resize)
  })

  return chart
}

export default initChart
