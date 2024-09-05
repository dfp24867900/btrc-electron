import { BeltReq } from './types'
import { Service } from '@/service/service'
import prefix from '@/service/prefix'

// 航医
// 获取首页顶部数据
export function getStatistics(): any {
  return Service({
    url: prefix.physiological + '/beltMonitorFile/countNo',
    method: 'get'
  })
}

// 获取飞行员统计数据
export function getPilotCount(): any {
  return Service({
    url: prefix.hy + '/beltMonitorFile/pilotCount',
    method: 'get'
  })
}

// 大屏
// 获取机型统计数据
export function getModelCount(): any {
  return Service({
    url: prefix.hy + '/beltMonitorFile/countPlane',
    method: 'get'
  })
}

//获取首页统计数据
//类型值：headerCount, middleLeft, middleRight, bottomLeft, bottomRight
export function getHomeCount(types: string): any {
  return Service({
    url: `${prefix.dataexchange}/count/home-page?types=${types}`,
    // url: `${prefix.physiological}/count/home-page?types=${types}`,
    method: 'get'
  })
}
