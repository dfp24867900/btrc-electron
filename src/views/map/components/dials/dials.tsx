import {
  defineComponent,
  onMounted,
  PropType,
  watch,
  ref,
  onUnmounted,
  nextTick
} from 'vue'
import * as Cesium from 'cesium'
import Styles from './index.module.scss'

const props = {
  show: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  heading: {
    type: Number as PropType<number>,
    default: 0
  },
  pitch: {
    type: Number as PropType<number>,
    default: 0
  },
  roll: {
    type: Number as PropType<number>,
    default: 0
  },
  height: {
    type: Number as PropType<number>,
    default: 0
  }
}

const Dials = defineComponent({
  name: 'Dials',
  props,
  setup(props) {
    const container = ref()
    const pitchRollRef = ref()
    const headingRef = ref()

    // 计算垂直视角角度
    let fovy = ref(27)
    const resizeDials = () => {
      fovy.value = window.viewer.camera.frustum.fovy * (180 / Math.PI)
    }

    let interval = 0
    let heightRadian = Cesium.Math.toDegrees(Math.atan(props.height / 120000))

    const initInterval = () => {
      if (props.show) {
        resizeDials()
        // 滚转角
        pitchRollRef.value.style.transform = `rotate(${props.roll}deg)`
        // 俯仰角
        heightRadian = Cesium.Math.toDegrees(Math.atan(props.height / 120000))
        pitchRollRef.value.style.marginTop = `${
          ((-props.pitch + heightRadian) * pitchRollRef.value.clientHeight) /
          fovy.value /
          Math.abs(Math.cos(Cesium.Math.toRadians(props.roll)))
        }px`
        // 航向角
        headingRef.value.style.left = `${(-props.heading * 100) / 180 + 50}%`
      }
    }

    watch(
      () => props.show,
      () => {
        nextTick(() => {
          container.value.style.display = props.show ? 'block' : 'none'
        })
      },
      {
        immediate: true
      }
    )

    onMounted(() => {
      interval = setInterval(initInterval, 16.6)
    })

    onUnmounted(() => {
      clearInterval(interval)
    })

    const pitchItem = [60, 50, 40, 30, 20, 10, 0, -10, -20, -30, -40, -50, -60]
    const headingItem = [
      '北',
      '30',
      '60',
      '东',
      '120',
      '150',
      '南',
      '210',
      '240',
      '西',
      '300',
      '330',
      '北',
      '30',
      '60',
      '东',
      '120',
      '150',
      '南'
    ]

    return {
      fovy,
      container,
      pitchRollRef,
      headingRef,
      pitchItem,
      headingItem
    }
  },
  render() {
    return (
      <div ref='container'>
        <div class={[Styles.rotateContainer]}>
          <div class={[Styles.rotateContent]}>
            <div ref='pitchRollRef' class={[Styles.rotate]}>
              <div class={[Styles.skyline]}>
                <div class={[Styles.divider_line]}></div>
                <div class={[Styles.divider_title]}></div>
                <div class={[Styles.divider_line]}></div>
              </div>
              <div
                class={[Styles.pitchLine]}
                style={{
                  height: (130 / this.fovy) * 100 + '%'
                }}
              >
                {this.pitchItem.map((item) => (
                  <div class={[Styles.pitchItem]}>
                    <div class={[Styles.divider_line]}></div>
                    <div class={[Styles.divider_title]}>{item}</div>
                    <div class={[Styles.divider_line]}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div class={[Styles.headingContainer]}>
          <div class={[Styles.headingContent]}>
            <div ref='headingRef' class={[Styles.heading]}>
              {this.headingItem.map((item) => (
                <div class={[Styles.headingItem]}>
                  <div class={[Styles.divider_title]}>{item}</div>
                  <div class={[Styles.divider_line]}></div>
                </div>
              ))}
            </div>
            <div class={[Styles.headingPoint]}>{'<'}</div>
          </div>
        </div>
      </div>
    )
  }
})

export default Dials
