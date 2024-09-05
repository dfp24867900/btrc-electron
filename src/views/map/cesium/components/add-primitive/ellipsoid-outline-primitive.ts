import * as Cesium from 'cesium'

// 创建 椭球体轮廓 对象的函数
const createEllipsoidOutlinePrimitive = (
  distance: number,
  clockCone: {
    minimumClock: number
    maximumClock: number
    minimumCone: number
    maximumCone: number
  },
  color: {
    r: number
    g: number
    b: number
  }
) => {
  const ellipsoidGeometry = new Cesium.EllipsoidOutlineGeometry({
    radii: new Cesium.Cartesian3(distance, distance, distance),
    innerRadii: new Cesium.Cartesian3(1, 1, 1),
    minimumClock: Cesium.Math.toRadians(clockCone.minimumClock), // 左右偏角
    maximumClock: Cesium.Math.toRadians(clockCone.maximumClock),
    minimumCone: Cesium.Math.toRadians(clockCone.minimumCone), // 上下偏角
    maximumCone: Cesium.Math.toRadians(clockCone.maximumCone),
    stackPartitions: 3,
    slicePartitions: 3,
    subdivisions: 8
  })
  const geometry =
    Cesium.EllipsoidOutlineGeometry.createGeometry(ellipsoidGeometry)

  return new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: geometry!,
      modelMatrix: Cesium.Matrix4.IDENTITY,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          Cesium.Color.fromBytes(color.r, color.g, color.b, 128)
        )
      }
    }),
    appearance: new Cesium.PerInstanceColorAppearance({
      flat: true,
      renderState: {
        depthTest: {
          enabled: true
        },
        lineWidth: Math.min(2.0, window.viewer.scene.maximumAliasedLineWidth)
      },
      closed: false // 设置为 false，仅显示轮廓边缘的线条
    }),
    asynchronous: false
  })
}

export default createEllipsoidOutlinePrimitive
