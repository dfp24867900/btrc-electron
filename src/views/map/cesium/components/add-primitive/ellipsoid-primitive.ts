import * as Cesium from 'cesium'

// 创建 椭球体 对象的函数
const createEllipsoidPrimitive = (
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
  },
  outline: boolean
) => {
  const ellipsoidPrimitive = new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.EllipsoidGeometry({
        radii: new Cesium.Cartesian3(distance, distance, distance),
        innerRadii: new Cesium.Cartesian3(1, 1, 1),
        minimumClock: Cesium.Math.toRadians(clockCone.minimumClock), // 左右偏角
        maximumClock: Cesium.Math.toRadians(clockCone.maximumClock),
        minimumCone: Cesium.Math.toRadians(clockCone.minimumCone), // 上下偏角
        maximumCone: Cesium.Math.toRadians(clockCone.maximumCone)
      }),
      modelMatrix: Cesium.Matrix4.IDENTITY
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      material: new Cesium.Material({
        fabric: {
          type: 'Color',
          uniforms: {
            color: Cesium.Color.fromBytes(color.r, color.g, color.b, 128)
          }
        }
      })
    }),
    asynchronous: false,
    allowPicking: false
  })

  if (outline) {
    const ellipsoidOutlinePrimitive = new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: Cesium.EllipsoidOutlineGeometry.createGeometry(
          new Cesium.EllipsoidOutlineGeometry({
            radii: new Cesium.Cartesian3(distance, distance, distance),
            innerRadii: new Cesium.Cartesian3(1, 1, 1),
            minimumClock: Cesium.Math.toRadians(clockCone.minimumClock), // 左右偏角
            maximumClock: Cesium.Math.toRadians(clockCone.maximumClock),
            minimumCone: Cesium.Math.toRadians(clockCone.minimumCone), // 上下偏角
            maximumCone: Cesium.Math.toRadians(clockCone.maximumCone),
            stackPartitions: 5,
            slicePartitions: 5,
            subdivisions: 10
          })
        )!,
        modelMatrix: Cesium.Matrix4.IDENTITY,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            Cesium.Color.fromBytes(color.r, color.g, color.b, 64)
          )
        }
      }),
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true,
        renderState: {
          depthTest: {
            enabled: true
          },
          lineWidth: 1
        },
        closed: false // 设置为 false，仅显示轮廓边缘的线条
      }),
      asynchronous: false,
      allowPicking: false
    })
    return [ellipsoidPrimitive, ellipsoidOutlinePrimitive]
  } else {
    return [ellipsoidPrimitive]
  }
}

export default createEllipsoidPrimitive
