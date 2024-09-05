import { reactive } from 'vue'
import type { MapOption } from './types'
import type { MapSetting } from './cesium/types'

export function useSetting(mapOption: MapOption) {
  const mapSetting = reactive({
    settingShow: false,
    settingOption: {
      label: {
        title: '标牌',
        defaultValue: false,
        type: 'switch',
        show: true,
        children: {
          defaultValue: [],
          option: [
            { label: '经度', value: 'lat' },
            { label: '纬度', value: 'lng' },
            { label: '高度', value: 'alt' },
            { label: '速度(表速)', value: 'bs' },
            { label: '法向过载', value: 'fxgz' },
            { label: '航向角', value: 'heading' },
            { label: '俯仰角', value: 'pitch' },
            { label: '滚转角', value: 'roll' }
          ]
        }
      },
      path: {
        title: '轨迹',
        defaultValue: true,
        type: 'switch',
        show: true
      },
      effect: {
        title: '特效',
        defaultValue: true,
        type: 'switch',
        show: mapOption.specialEffects,
        children: {
          defaultValue: [
            'FIGHTER_FIXED_RADAR',
            'FIGHTER_AFTERBURNER',
            'FIGHTER_EMI',
            'FIGHTER_IRCM',
            'FIGHTER_FIGHTERHIT',
            'MISSIL_TERMINAL_GUIDANCE',
            'RADAR_STATION_COVER_RADAR'
          ],
          option: [
            { label: '机载雷达', value: 'FIGHTER_FIXED_RADAR' },
            { label: '加力', value: 'FIGHTER_AFTERBURNER' },
            { label: '电磁干扰', value: 'FIGHTER_EMI' },
            { label: '红外干扰', value: 'FIGHTER_IRCM' },
            { label: '命中效果', value: 'FIGHTER_FIGHTERHIT' },
            { label: '末端制导', value: 'MISSIL_TERMINAL_GUIDANCE' }
            // { label: '地面雷达', value: 'RADAR_STATION_COVER_RADAR' }
          ]
        }
      }
    },
    labelEvalStr: '',
    effectShowRef: {
      FIGHTER_FIXED_RADAR: true,
      FIGHTER_AFTERBURNER: true,
      FIGHTER_EMI: true,
      FIGHTER_IRCM: true,
      FIGHTER_FIGHTERHIT: true,
      MISSIL_TERMINAL_GUIDANCE: true,
      RADAR_STATION_COVER_RADAR: true
    }
  } as MapSetting)

  // 计算标牌显示项
  const computeLabelStr = (value: string[]) => {
    let string = ''
    value.forEach((a, i) => {
      mapSetting.settingOption.label.children?.option.find((b) => {
        if (a === b.value) {
          string = string + b.label + '：${' + b.value + '}'
          if (i != value.length - 1) {
            string += '\n'
          }
        }
      })
    })
    mapSetting.labelEvalStr = string
  }

  // 计算特效显隐
  const computeEffect = (value: string[], show: boolean) => {
    Object.keys(mapSetting.effectShowRef).forEach((item: string) => {
      mapSetting.effectShowRef[item] = show && value.includes(item)
    })
  }

  // 地图设置修改
  const settingUpdate = (
    value: string[] | boolean,
    type: string,
    source: string
  ) => {
    switch (type) {
      case 'label':
        if (source == 'switch' && typeof value == 'boolean') {
          controlLabelPath(type, value)
        } else if (typeof value == 'object') {
          computeLabelStr(value)
        }
        break
      case 'path':
        typeof value == 'boolean' && controlLabelPath(type, value)
        break
      case 'effect':
        if (source == 'switch' && typeof value == 'boolean') {
          computeEffect(
            mapSetting.settingOption.effect.children!.defaultValue,
            value
          )
        } else if (typeof value == 'object') {
          computeEffect(value, mapSetting.settingOption.effect.defaultValue)
        }
        break
      default:
        break
    }
  }

  // 控制所有标签、轨迹
  const controlLabelPath = (type: string, value: boolean) => {
    window.viewer.entities.values.forEach((item: any) => {
      if (item.type == 'model') {
        item[type].show = value
      }
    })
  }

  return { mapSetting, settingUpdate }
}
