import * as Cesium from 'cesium'

// 创建 椭球体 对象的函数
const createTerminalGuidance = (
  radii: {
    radii: number
    innerRadii: number
  }[],
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
  const GeometryInstance: Cesium.GeometryInstance[] = []
  for (let i = 0; i < radii.length; i++) {
    let item = radii[i]
    GeometryInstance.push(
      new Cesium.GeometryInstance({
        geometry: new Cesium.EllipsoidGeometry({
          radii: new Cesium.Cartesian3(item.radii, item.radii, item.radii),
          innerRadii: new Cesium.Cartesian3(
            item.innerRadii,
            item.innerRadii,
            item.innerRadii
          ),
          minimumClock: Cesium.Math.toRadians(clockCone.minimumClock), // 左右偏角
          maximumClock: Cesium.Math.toRadians(clockCone.maximumClock),
          minimumCone: Cesium.Math.toRadians(clockCone.minimumCone), // 上下偏角
          maximumCone: Cesium.Math.toRadians(clockCone.maximumCone)
        }),
        modelMatrix: Cesium.Matrix4.IDENTITY
      })
    )
  }

  const ellipsoidPrimitive = new Cesium.Primitive({
    geometryInstances: GeometryInstance,
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

  return ellipsoidPrimitive
}

export default createTerminalGuidance
