interface StatisticsRes {
  pilotNo: string
  flightTaskNo: string
  beltNo: string
  mattressFileNo: string
}

interface BeltReq {
  timeType: string
  dataType: string
}

interface BeltRes {
  flightTimeCounts: BeltData[]
}

interface BeltData {
  name: string
  flightDuration: string
  grade: string
}

interface BarChartData {
  xAxisData: Array<string>
  seriesData: Array<number>
}

export { BeltReq, StatisticsRes, BarChartData, BeltRes }
