export interface IChartDataItem {
  name: string
  value?: string | number
  children?: IChartDataItem[]
}

/// 航医
export interface ILinesSeries {
  data: Array<number>
  type: string
}
export interface IBeltSeries extends ILinesSeries {
  color: string
}

export interface I3DSeries {
  data: Array<Array<number>>
  type: string
}

export interface IDataAccessSeries {
  name: string
  type: string
  data: Array<number>
  barGap: number
}
export interface ITaskSeries {
  name: string
  type?: string
  smooth?: boolean
  data: Array<number>
}
export interface IStorageSeries {
  type: string
  radius: Array<string>
  avoidLabelOverlap: boolean
  label: Object
  emphasis: Object
  labelLine: Object
}
