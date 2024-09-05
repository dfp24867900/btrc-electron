interface RegisterReq {
  id: string
  name: string
  dtoDataProvideType: string
  realtimeDBConfigs?: string
  dataIntervalMS?: string
  dbName?: string
}

export { RegisterReq }
