import * as Cesium from 'cesium'

export function useDateFormatter() {
  const dateFormatter = (viewer: any) => {
    //cesium时钟时间格式化
    viewer.timeline.makeLabel = (datetime: Cesium.JulianDate) => {
      let julianDT = new Cesium.JulianDate()
      Cesium.JulianDate.addHours(datetime, 8, julianDT)
      let gregorianDT = Cesium.JulianDate.toGregorianDate(julianDT)

      let hour = gregorianDT.hour + ''
      let minute = gregorianDT.minute + ''
      let second = gregorianDT.second + ''
      return `${hour.padStart(2, '0')}:${minute.padStart(
        2,
        '0'
      )}:${second.padStart(2, '0')}`
    }
    //cesium时钟日期格式化
    if (viewer.animation) {
      viewer.animation.viewModel.dateFormatter = (
        datetime: Cesium.JulianDate
      ) => {
        let julianDT = new Cesium.JulianDate()
        Cesium.JulianDate.addHours(datetime, 8, julianDT)
        let gregorianDT = Cesium.JulianDate.toGregorianDate(julianDT)
        return `${gregorianDT.year}年${gregorianDT.month}月${gregorianDT.day}日`
      }
      //cesium时间轴格式化
      viewer.animation.viewModel.timeFormatter = (
        datetime: Cesium.JulianDate
      ) => {
        let julianDT = new Cesium.JulianDate()
        Cesium.JulianDate.addHours(datetime, 8, julianDT)
        let gregorianDT = Cesium.JulianDate.toGregorianDate(julianDT)

        let hour = gregorianDT.hour + ''
        let minute = gregorianDT.minute + ''
        let second = gregorianDT.second + ''
        return `${hour.padStart(2, '0')}:${minute.padStart(
          2,
          '0'
        )}:${second.padStart(2, '0')}`
      }
    }
  }

  return { dateFormatter }
}
