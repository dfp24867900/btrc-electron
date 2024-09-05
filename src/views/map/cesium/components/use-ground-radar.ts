import * as Cesium from 'cesium'

export function useGroundRadar() {
  // 中空雷达扫描
  const addGroundRadar = (
    viewer: any,
    {
      id,
      position,
      radius,
      color,
      outlineColor,
      speed
    }: {
      id: string
      position: number[]
      radius: number
      color: Cesium.Color
      outlineColor: Cesium.Color
      speed: number
    }
  ) => {
    viewer.entities.removeById(`${id}_polylineVolume`)
    viewer.entities.removeById(`${id}_radarSurface`)

    const computeCircle = (radius: number) =>
      Array.from({ length: 120 }, (_, i) => {
        const radians = Cesium.Math.toRadians(i * 3)
        return new Cesium.Cartesian2(
          radius * Math.cos(radians),
          radius * Math.sin(radians)
        )
      })

    const countCircle = (t: number, e: number[]) => {
      const r = (t / (2 * Math.PI * 6371004)) * 360
      let s = []
      for (let i = 0; i <= 361; i += 1) {
        let x = e[0] + r * Math.cos((i * Math.PI) / 180) * 1.308
        let y = e[1] + r * Math.sin((i * Math.PI) / 180)
        s.push(x, y)
      }
      return s
    }

    const computePosition = (t: number, e: number[]) => {
      const r = (t / (2 * Math.PI * 6371004)) * 360
      let s = []
      for (let i = 0; i <= 360 / speed; i += 1) {
        let x =
          e[0] +
          r * Math.cos(((i * speed * Math.PI) / 180) * 1.308) * 1.308 -
          e[0]
        let y = e[1] + r * Math.sin((i * speed * Math.PI) / 180)
        s.push([x, y])
      }
      return s
    }

    let headingOffset = 0
    let indexOffset = 0
    const radarPosition = computePosition(radius, position)

    const radarRange = viewer.entities.add({
      id: `${id}_polylineVolume`,
      name: '雷达扫描',
      show: false,
      position: Cesium.Cartesian3.fromDegreesArray(
        countCircle(radius, position)
      ),
      polylineVolume: {
        positions: computeCircle(radius),
        shape: computeCircle(radius),
        fill: false,
        outline: true,
        outlineColor,
        outlineWidth: 1
      }
    })

    const radarScan = viewer.entities.add({
      id: `${id}_radarSurface`,
      name: '雷达扫描面',
      show: false,
      position: new Cesium.CallbackProperty(() => {
        if (!radarScan.show) return
        indexOffset += 1
        if (indexOffset >= 360 / speed) {
          indexOffset = 0
          headingOffset = 0
        }
        return Cesium.Cartesian3.fromDegrees(
          position[0] + radarPosition[indexOffset][0],
          position[1] + radarPosition[indexOffset][1]
        )
      }, false),
      ellipsoid: {
        radii: new Cesium.Cartesian3(radius, radius, radius),
        innerRadii: new Cesium.Cartesian3(1.0, 1.0, 1.0),
        minimumClock: new Cesium.CallbackProperty(() => {
          if (!radarScan.show) return
          headingOffset += 0.034905 * speed
          return headingOffset
        }, false),
        maximumClock: new Cesium.CallbackProperty(
          () => headingOffset + 0.001,
          false
        ),
        minimumCone: Cesium.Math.toRadians(-90),
        maximumCone: Cesium.Math.toRadians(90),
        material: color,
        outline: false
      }
    })

    return { radarRange, radarScan }
  }

  // 半球雷达扫描
  const radarSolidScan = (
    viewer: Cesium.Viewer,
    options: {
      position: number[]
      radius: number
      color: Cesium.Color
      outlineColor: Cesium.Color
      speed: number
    }
  ) => {
    // 先建立椭球体
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        options.position[0],
        options.position[1]
      ),
      name: '立体雷达扫描',
      ellipsoid: {
        radii: new Cesium.Cartesian3(
          options.radius,
          options.radius,
          options.radius
        ),
        maximumCone: Math.PI / 2,
        material: options.color,
        outline: true,
        outlineColor: options.outlineColor,
        outlineWidth: 1
      }
    })

    let heading = 0
    let positionArr: number[] = [0, 0, 0]
    const callBack = () => {
      return () => {
        heading += options.speed
        positionArr = calculatePane(
          options.position[0],
          options.position[1],
          options.radius,
          heading
        )
      }
    }
    // 每一帧刷新时调用
    viewer.clock.onTick.addEventListener(callBack())

    // 创建1/4圆形立体墙
    let radarWall = viewer.entities.add({
      wall: {
        positions: new Cesium.CallbackProperty(() => {
          return Cesium.Cartesian3.fromDegreesArrayHeights(positionArr)
        }, false),
        material: options.color
      }
    })

    // 计算平面扫描范围
    const calculatePane = (
      x1: number,
      y1: number,
      radius: number,
      heading: number
    ) => {
      let m = Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(x1, y1) //以度为单位的经度和纬度值返回Cartesian3的位置
      )
      let rx = radius * Math.cos((heading * Math.PI) / 180.0)
      let ry = radius * Math.sin((heading * Math.PI) / 180.0)
      let translation = Cesium.Cartesian3.fromElements(rx, ry, 0) //根据x,y和z坐标创建Cartesian3实例
      let d = Cesium.Matrix4.multiplyByPoint(
        m,
        translation,
        new Cesium.Cartesian3()
      )
      let c = Cesium.Cartographic.fromCartesian(d) //从笛卡尔位置创建一个新的制图实例
      let x2 = Cesium.Math.toDegrees(c.longitude)
      let y2 = Cesium.Math.toDegrees(c.latitude)
      return calculateSector(x1, y1, x2, y2)
    }

    // 计算竖直扇形
    const calculateSector = (
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => {
      let positionArr = []
      positionArr.push(x1)
      positionArr.push(y1)
      positionArr.push(0)
      let radius = Cesium.Cartesian3.distance(
        Cesium.Cartesian3.fromDegrees(x1, y1),
        Cesium.Cartesian3.fromDegrees(x2, y2)
      )
      // 扇形是1/4圆，因此角度设置为0-90
      for (let i = 0; i <= 90; i++) {
        let h = radius * Math.sin((i * Math.PI) / 180.0)
        let r = Math.cos((i * Math.PI) / 180.0)
        let x = (x2 - x1) * r + x1
        let y = (y2 - y1) * r + y1
        positionArr.push(x)
        positionArr.push(y)
        positionArr.push(h)
      }
      return positionArr
    }
  }

  return { addGroundRadar, radarSolidScan }
}
