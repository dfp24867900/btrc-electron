import { Service } from '@/service/service'
import { RegisterReq } from './types'
import prefix from '../../prefix'

/**
 * 数据管理
 *
 */

// 关键事件筛选列表
export function queryKeyEventsTypeList(params: {
  flightTaskId: string
  pilotId: number
}): any {
  return Service({
    url: prefix.physiological + '/KeyEvents/keyEventsTypeList',
    method: 'get',
    params
  })
}

// 查询关键事件
export function queryKeyEvent(params: any): any {
  return Service({
    url: prefix.physiological + '/KeyEvents/list',
    method: 'get',
    params
  })
}

// 新增关键事件
export function createKeyEvent(data: any): any {
  return Service({
    url: prefix.physiological + '/KeyEvents/create',
    method: 'post',
    data
  })
}

// 修改关键事件
export function updateKeyEvent(data: any): any {
  return Service({
    url: prefix.physiological + '/KeyEvents/update',
    method: 'post',
    data
  })
}

// 删除关键事件
export function deleteKeyEvent(params: any): any {
  return Service({
    url: prefix.physiological + '/KeyEvents/delete',
    method: 'get',
    params
  })
}

// 创建或更新指标项
export function keyEventTarget(data: any): any {
  return Service({
    url: prefix.physiological + '/KeyEvents/index',
    method: 'post',
    data
  })
}

// 计算指标项
export function computeTarget(params: any): any {
  return Service({
    url: prefix.physiological + '/KeyEvents/computeIndex',
    method: 'get',
    params,
    timeout: 30000
  })
}

// 计算飞行指标
export function computFlight(params: any): any {
  return Service({
    url: prefix.physiological + '/KeyEvents/computeFXQDandFXND',
    method: 'get',
    params
  })
}
/////////////////////

/////////// 报告页 /////////////
// 获取任务开始/结束时间
export function getStartEndTime(params: { taskId: string }) {
  return Service({
    url: prefix.physiological + `/ReportData/queryStartAndEndTime`,
    method: 'get',
    params
  })
}
//事件列表数据
export function getEventData(params: { taskId: string; pilotId: number }) {
  return Service({
    url: prefix.physiological + `/ReportData/queryReportEventsData`,
    method: 'get',
    params
  })
}

// 基础信息 ---------------------
export function getReportTopData(params: { taskId: string; pilotId: number }) {
  return Service({
    url: prefix.physiological + `/ReportData/queryReportTopData`,
    method: 'get',
    params
  })
}
//任务基本信息-header
export function getReportHeader(params: { taskId: string; pilotId: number }) {
  return Service({
    url: prefix.physiological + `/ReportData/header`,
    method: 'get',
    params
  })
}

//任务基本信息-header -- 未测试
export function getChartData(params: { taskId: string; pilotId: number }) {
  return Service({
    url: prefix.physiological + `/ReportData/chartData`,
    method: 'get',
    params
  })
}

// 睡眠数据
export function getSleepData(params: { taskId: string; pilotId: number }) {
  return Service({
    url: prefix.physiological + `/sleepData/sleepData`,
    method: 'get',
    params
  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 查询所有任务 - 暂未使用
export function queryFlightTask(): any {
  return Service({
    url: prefix.physiological + '/Flight/flightlist',
    method: 'get'
  })
}

// 查询模型路径
export function queryModelPath(): any {
  return Service({
    url: prefix.gis + '/project/queryModelPath',
    method: 'post'
  })
}

// 注册项目
export function projectRegister(data: RegisterReq): any {
  return Service({
    url: prefix.gis + '/project/register',
    method: 'post',
    data
  })
}

// 任务基本数据
export function getTaskData(params: { taskId: string; pilotId: string }) {
  return Service({
    url: prefix.physiological + `/DwFlightMetaDataInfo/queryTableNamesV2`,
    method: 'get',
    params
  })
}

// 获取ecg/胸呼吸数据
export function getSubcontract(params: {
  taskId: string
  pilotId: string
  startMsgId: number
  endMsgId: number
}) {
  return Service({
    url: prefix.physiological + `/physiological/data/show/subcontract`,
    method: 'get',
    params,
    timeout: 600000
  })
}

// 心率和呼吸率
export function getFulldata(params: {
  taskId: string
  pilotId: string
  startMsgId: number
  endMsgId: number
}) {
  return Service({
    url: prefix.physiological + `/physiological/data/show/fulldata`,
    method: 'get',
    params
  })
}

// 标签数据
export function getLabelData(params: {
  taskId: string
  pilotId: string
  planeId: string
}) {
  return Service({
    url: prefix.physiological + `/physiological/data/show/label`,
    method: 'get',
    params,
    timeout: 60000
  })
}
//三个方向图标数据
export function getAngleChart(params: {
  taskId: string
  pilotId: string
  startMsgId: number
  endMsgId: number
}) {
  return Service({
    url: prefix.physiological + `/ReportData/queryReportAngleData`,
    method: 'get',
    params
  })
}
//三个速度
export function getSpeedChart(params: {
  taskId: string
  pilotId: string
  startMsgId: number
  endMsgId: number
}) {
  return Service({
    url: prefix.physiological + `/ReportData/queryReportSpeedData`,
    method: 'get',
    params
  })
}
//任务基本信息
export function getBasicData(params: { taskId: string; pilotId: number }) {
  return Service({
    url: prefix.physiological + `/ReportData/queryBasicData`,
    method: 'get',
    params
  })
}

// 根据任务查询飞行员列表
export function getPilotList(params: { taskId: string }): any {
  return Service({
    url: prefix.physiological + `/dataTest/queryPilot`,
    method: 'get',
    params
  })
}

// 查询飞行员生理数据
export function queryPilotStress(params: {
  taskId: string
  pilotId: number
}): any {
  return Service({
    url: prefix.physiological + `/dataTest/queryPilotStress`,
    method: 'get',
    params
  })
}

// 查询任务中事件列表
export function queryTimeEvent(params: { taskId: string }): any {
  return Service({
    url: prefix.physiological + `/dataTest/queryHitEvent`,
    method: 'get',
    params
  })
}

///////////////////////////////// 全流程调试接口 //////////////////////////////////////////////////////////////
// 任务数据(人员、起止时间、视角位置)
export function getBasicDatas(
  params: { taskId: string },
  url: string = `/task-analyzer/basicData`
) {
  return Service({
    url: prefix.physiological + url,
    method: 'get',
    params
  })
}

// 获取gis文件名列表
export function getGisFiles(params: { gisDataSN: string }) {
  return Service({
    url: prefix.physiological + '/task-analyzer/dataSendType',
    method: 'get',
    params
  })
}

// 获取图表数据
export function getFullChartdata(params: { taskId: string; pilotId: number }) {
  return Service({
    url: prefix.physiological + `/task-analyzer/physiologicalData/whole`,
    method: 'get',
    params
  })
}

// 获取ecg/胸呼吸数据
export function getSubChartdata(params: { taskId: string; pilotId: number }) {
  return Service({
    url: prefix.physiological + `/task-analyzer/physiologicalData/subPacket`,
    method: 'get',
    params,
    timeout: 600000
  })
}

// 查询人员应激数据
export function getPilotStress(params: {
  taskId: string
  pilotId: number
}): any {
  return Service({
    url: prefix.physiological + `/task-analyzer/stress`,
    method: 'get',
    params
  })
}

// 查询任务中事件列表
export function getTimeEvent(params: { taskId: string }, url: string): any {
  return Service({
    url: prefix.physiological + url,
    method: 'get',
    params
  })
}

// 查询任务中事件列表
export function getTimeEvent_new(params: { taskId: string }): any {
  return Service({
    url: prefix.physiological + `/19Http/bulletinBoard`,
    method: 'get',
    params
  })
}
