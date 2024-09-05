import * as Cesium from 'cesium'
import createEllipsoidPrimitive from './add-primitive/ellipsoid-primitive'
import createTerminalGuidance from './add-primitive/terminal-guidance-primitive'
import type { Propertys, MapVariables, MapSetting } from '../types'

export function useGeometry(
  mapVariables: MapVariables,
  mapSetting: MapSetting
) {
  // 添加机载雷达
  const addFighterRadar = (
    viewer: any,
    propertys: Propertys,
    id: string,
    modelEntity: any
  ) => {
    let ellipsoidRadar: Cesium.Primitive[] = []
    let thisTime: Cesium.JulianDate
    viewer.scene.preRender.addEventListener(
      (scene: Cesium.Scene, time: Cesium.JulianDate) => {
        if (Cesium.JulianDate.equals(time, thisTime)) return
        thisTime = Cesium.JulianDate.clone(time)

        for (let i = 0; i < ellipsoidRadar.length; i++) {
          viewer.scene.primitives.remove(ellipsoidRadar[i])
        }

        // 关闭机载雷达或者第一视角
        if (
          !mapSetting.effectShowRef['FIGHTER_FIXED_RADAR'] ||
          mapVariables.isFirstPerson
        )
          return

        let distance = 0.01
        const clockCone = {
          minimumClock: 170,
          maximumClock: 190,
          minimumCone: 85,
          maximumCone: 95
        }
        const color = {
          r: 255,
          g: 255,
          b: 255
        }

        const radiusColor = propertys.radiusColor.getValue(time) // 半径颜色
        const radarAngle = propertys.radarAngle.getValue(time) // 角度范围
        const position = propertys.position.getValue(time)
        const hpr = propertys.hprProperty.getValue(time)
        if (!position || !radarAngle || !radiusColor || !hpr) return
        distance = radiusColor.x
        color.r = radiusColor.y
        color.g = radiusColor.z
        color.b = radiusColor.w
        clockCone.minimumClock = 180 - radarAngle.z / 2
        clockCone.maximumClock = 180 + radarAngle.z / 2
        clockCone.minimumCone = 90 - radarAngle.w / 2
        clockCone.maximumCone = 90 + radarAngle.w / 2

        if (distance < 1 || radarAngle.z == 0 || radarAngle.w == 0) return
        const orientation = Cesium.Matrix3.fromQuaternion(
          Cesium.Transforms.headingPitchRollQuaternion(
            position,
            new Cesium.HeadingPitchRoll(
              Cesium.Math.toRadians(hpr.x + radarAngle.x),
              Cesium.Math.toRadians(hpr.y + radarAngle.y),
              Cesium.Math.toRadians(hpr.z)
            )
          )
        )

        // 将位置和旋转矩阵应用于模型矩阵中
        const modelMatrix = Cesium.Matrix4.fromRotationTranslation(
          orientation,
          position
        )

        ellipsoidRadar = createEllipsoidPrimitive(
          distance,
          clockCone,
          color,
          true
        )

        if (!modelMatrix) return
        for (let i = 0; i < ellipsoidRadar.length; i++) {
          ellipsoidRadar[i].modelMatrix = modelMatrix
          viewer.scene.primitives.add(ellipsoidRadar[i])
        }
      }
    )
  }

  // 添加末端制导
  const addMissilTerminalGuidance = (
    viewer: any,
    propertys: Propertys,
    id: string,
    modelEntity: any
  ) => {
    let terminalGuidance: Cesium.Primitive
    let radiiInnerRadii: number[] = [0, 0.33, 0.66]
    let thisTime: Cesium.JulianDate
    viewer.scene.preRender.addEventListener(
      (scene: Cesium.Scene, time: Cesium.JulianDate) => {
        if (Cesium.JulianDate.equals(time, thisTime)) return
        thisTime = Cesium.JulianDate.clone(time)
        viewer.scene.primitives.remove(terminalGuidance)

        // 关闭末端制导
        if (!mapSetting.effectShowRef['MISSIL_TERMINAL_GUIDANCE']) return

        const modelMatrix = modelEntity.computeModelMatrix(
          time,
          new Cesium.Matrix4()
        )

        let terminalGuidanceDistance = 5000
        let terminalGuidanceRadii: {
          radii: number
          innerRadii: number
        }[] = []

        radiiInnerRadii = radiiInnerRadii.map((oldValue) => {
          let newValue = oldValue + 0.015
          if (newValue >= 1) newValue = 0
          let distance = terminalGuidanceDistance * newValue
          terminalGuidanceRadii.push({
            radii: distance,
            innerRadii: distance + 10
          })
          return newValue
        })

        terminalGuidance = createTerminalGuidance(
          terminalGuidanceRadii,
          {
            minimumClock: 175,
            maximumClock: 185,
            minimumCone: 85,
            maximumCone: 95
          },
          {
            r: 255,
            g: 0,
            b: 0
          }
        )
        if (!modelMatrix) return
        terminalGuidance.modelMatrix = modelMatrix
        viewer.scene.primitives.add(terminalGuidance)
      }
    )
  }

  return { addFighterRadar, addMissilTerminalGuidance }
}
