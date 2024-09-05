import * as Cesium from 'cesium'
import type { Propertys, MapVariables, MapSetting } from '../types'

export function useGeometry(
  mapVariables: MapVariables,
  mapSetting: MapSetting
) {
  const addFighterRadar = (
    viewer: any,
    propertys: Propertys,
    id: string,
    modelEntity: any
  ) => {
    const fanRadarEntity = viewer.entities.add({
      id: id + '_fanRadar',
      show: false,
      position: propertys.position,
      orientation: propertys.orientation,
      parent: modelEntity,
      ellipsoid: {
        radii: new Cesium.Cartesian3(1, 1, 1), // 扇形半径
        innerRadii: new Cesium.Cartesian3(1, 1, 1), // 内半径
        minimumClock: Cesium.Math.toRadians(180), // 左右偏角
        maximumClock: Cesium.Math.toRadians(180),
        minimumCone: Cesium.Math.toRadians(90), // 上下偏角
        maximumCone: Cesium.Math.toRadians(90),
        material: Cesium.Color.DARKCYAN.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.DARKCYAN.withAlpha(0.25),
        outlineWidth: 1
      }
    })

    // 机载雷达扫描面
    let airborneSpeed = 0.1 // 扫描速度
    let headingOffset = 0 // 偏移量
    const sectorEntity = viewer.entities.add({
      id: id + '_sector',
      show: false,
      position: propertys.position,
      orientation: propertys.orientation,
      leftAngle: 0,
      ellipsoid: {
        radii: new Cesium.Cartesian3(1, 1, 1), // 扇形半径
        innerRadii: new Cesium.Cartesian3(1, 1, 1), // 内半径
        minimumClock: new Cesium.CallbackProperty((time) => {
          headingOffset = headingOffset + airborneSpeed
          if (
            headingOffset < sectorEntity.leftAngle / -2 ||
            headingOffset > sectorEntity.leftAngle / 2
          ) {
            airborneSpeed /= -1
          }
          sectorEntity.ellipsoid.maximumClock = Cesium.Math.toRadians(
            180.01 + headingOffset
          )
          return Cesium.Math.toRadians(180 + headingOffset)
        }, false),
        maximumClock: Cesium.Math.toRadians(180.01 + headingOffset),
        minimumCone: Cesium.Math.toRadians(90), // 上下偏角  可以都设置为90
        maximumCone: Cesium.Math.toRadians(90),
        material: Cesium.Color.DARKCYAN.withAlpha(0.2),
        outline: false
      }
    })

    viewer.scene.preUpdate.addEventListener(
      (scene: Cesium.Scene, time: Cesium.JulianDate) => {
        const radiusColor = propertys.radiusColor.getValue(time)
        const radarAngle = propertys.radarAngle.getValue(time)
        const position = propertys.position.getValue(time)
        const headingPitchRoll = propertys.hprProperty.getValue(time)
        if (
          radiusColor &&
          radarAngle &&
          position &&
          modelEntity.show &&
          mapSetting.effectShowRef['FIGHTER_FIXED_RADAR']
        ) {
          if (radiusColor.x < 1 || radarAngle.z == 0 || radarAngle.w == 0)
            return
          const distance = radiusColor.x
          let material = Cesium.Color.fromBytes(
            radiusColor.y,
            radiusColor.z,
            radiusColor.w,
            75
          )
          let outlineColor = Cesium.Color.fromBytes(
            radiusColor.y,
            radiusColor.z,
            radiusColor.w,
            64
          )
          let radii = new Cesium.Cartesian3(distance, distance, distance)
          // 上下范围
          let minimumCone = Cesium.Math.toRadians(90 - radarAngle.w / 2)
          let maximumCone = Cesium.Math.toRadians(90 + radarAngle.w / 2)
          const orientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            new Cesium.HeadingPitchRoll(
              Cesium.Math.toRadians(radarAngle.x + (headingPitchRoll?.x || 0)),
              Cesium.Math.toRadians(radarAngle.y + (headingPitchRoll?.y || 0)),
              Cesium.Math.toRadians(headingPitchRoll?.z || 0)
            )
          )
          // 雷达
          fanRadarEntity.show = radiusColor.x > 1 ? true : false
          fanRadarEntity.orientation = orientation // 角度
          fanRadarEntity.ellipsoid.radii = radii // 半径
          fanRadarEntity.ellipsoid.material = material // 材质
          fanRadarEntity.ellipsoid.outlineColor = outlineColor // 边框
          // 左右范围
          fanRadarEntity.ellipsoid.minimumClock = Cesium.Math.toRadians(
            180 - radarAngle.z / 2
          )
          fanRadarEntity.ellipsoid.maximumClock = Cesium.Math.toRadians(
            180 + radarAngle.z / 2
          )
          fanRadarEntity.ellipsoid.minimumCone = minimumCone // 上
          fanRadarEntity.ellipsoid.maximumCone = maximumCone // 下
          // 雷达扫描面
          sectorEntity.show = radiusColor.x > 1 ? true : false
          sectorEntity.orientation = orientation // 角度
          sectorEntity.leftAngle = radarAngle.z // 左右偏角
          sectorEntity.ellipsoid.radii = radii // 半径
          sectorEntity.ellipsoid.material = material // 材质
          sectorEntity.ellipsoid.minimumCone = minimumCone // 上
          sectorEntity.ellipsoid.maximumCone = maximumCone // 下
        } else {
          fanRadarEntity.show = false
          sectorEntity.show = false
        }
      }
    )
  }

  const addMissilTerminalGuidance = (
    viewer: any,
    propertys: Propertys,
    id: string,
    modelEntity: any
  ) => {
    let radii = 0
    let radii2 = 0.33
    let radii3 = 0.66
    const terminalGuidance1 = viewer.entities.add({
      id: id + '_terminalGuidance1',
      name: '末端制导',
      show: false,
      parent: modelEntity,
      position: propertys.position,
      orientation: propertys.orientation,
      distance: 1000,
      ellipsoid: {
        radii: new Cesium.CallbackProperty((time) => {
          let distance: number = terminalGuidance1.distance
          if (radii >= 1) {
            radii = 0
          }
          radii += 0.003
          terminalGuidance1.ellipsoid.innerRadii = new Cesium.Cartesian3(
            distance * radii * 1.75,
            distance * radii * 1.75,
            distance * radii * 1.75
          )
          if (radii2 >= 1) {
            radii2 = 0
          }
          radii2 += 0.003
          terminalGuidance2.ellipsoid.radii = new Cesium.Cartesian3(
            distance * radii2,
            distance * radii2,
            distance * radii2
          )
          terminalGuidance2.ellipsoid.innerRadii = new Cesium.Cartesian3(
            distance * radii2 * 1.75,
            distance * radii2 * 1.75,
            distance * radii2 * 1.75
          )
          if (radii3 >= 1) {
            radii3 = 0
          }
          radii3 += 0.003
          terminalGuidance3.ellipsoid.radii = new Cesium.Cartesian3(
            distance * radii3,
            distance * radii3,
            distance * radii3
          )
          terminalGuidance3.ellipsoid.innerRadii = new Cesium.Cartesian3(
            distance * radii3 * 1.75,
            distance * radii3 * 1.75,
            distance * radii3 * 1.75
          )
          return new Cesium.Cartesian3(
            distance * radii,
            distance * radii,
            distance * radii
          )
        }, false),
        innerRadii: new Cesium.Cartesian3(1, 1, 1), // 内半径
        minimumClock: Cesium.Math.toRadians(180 - 10 / 2), // 左右偏角
        maximumClock: Cesium.Math.toRadians(180 + 10 / 2),
        minimumCone: Cesium.Math.toRadians(90 - 10 / 2), // 上下偏角
        maximumCone: Cesium.Math.toRadians(90 + 10 / 2),
        material: Cesium.Color.DARKCYAN.withAlpha(0.5),
        outline: false,
        outlineColor: Cesium.Color.DARKCYAN.withAlpha(0.25),
        outlineWidth: 1
      }
    })
    const terminalGuidance2 = viewer.entities.add({
      id: id + '_terminalGuidance2',
      name: '末端制导',
      show: false,
      parent: modelEntity,
      position: propertys.position,
      orientation: propertys.orientation,
      ellipsoid: {
        radii: new Cesium.Cartesian3(1, 1, 1), // 扇形半径
        innerRadii: new Cesium.Cartesian3(1, 1, 1), // 内半径
        minimumClock: Cesium.Math.toRadians(180 - 10 / 2), // 左右偏角
        maximumClock: Cesium.Math.toRadians(180 + 10 / 2),
        minimumCone: Cesium.Math.toRadians(90 - 10 / 2), // 上下偏角
        maximumCone: Cesium.Math.toRadians(90 + 10 / 2),
        material: Cesium.Color.DARKCYAN.withAlpha(0.5),
        outline: false,
        outlineColor: Cesium.Color.DARKCYAN.withAlpha(0.25),
        outlineWidth: 1
      }
    })
    const terminalGuidance3 = viewer.entities.add({
      id: id + '_terminalGuidance3',
      name: '末端制导',
      show: false,
      parent: modelEntity,
      position: propertys.position,
      orientation: propertys.orientation,
      ellipsoid: {
        radii: new Cesium.Cartesian3(1, 1, 1), // 扇形半径
        innerRadii: new Cesium.Cartesian3(1, 1, 1), // 内半径
        minimumClock: Cesium.Math.toRadians(180 - 10 / 2), // 左右偏角
        maximumClock: Cesium.Math.toRadians(180 + 10 / 2),
        minimumCone: Cesium.Math.toRadians(90 - 10 / 2), // 上下偏角
        maximumCone: Cesium.Math.toRadians(90 + 10 / 2),
        material: Cesium.Color.DARKCYAN.withAlpha(0.5),
        outline: false,
        outlineColor: Cesium.Color.DARKCYAN.withAlpha(0.25),
        outlineWidth: 1
      }
    })

    viewer.scene.preUpdate.addEventListener(
      (scene: Cesium.Scene, time: Cesium.JulianDate) => {
        if (!modelEntity.show) return
        let terminalGuidance = propertys.terminalGuidance.getValue(time)
        if (
          terminalGuidance &&
          mapSetting.effectShowRef['MISSIL_TERMINAL_GUIDANCE']
        ) {
          let position = propertys.position.getValue(time)
          if (!position) return
          const orientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            new Cesium.HeadingPitchRoll(
              Cesium.Math.toRadians(terminalGuidance.z / 1 + 90),
              Cesium.Math.toRadians(terminalGuidance.w / -1),
              Cesium.Math.toRadians(0)
            )
          )
          terminalGuidance1.show = terminalGuidance.x
          terminalGuidance2.show = terminalGuidance.x
          terminalGuidance3.show = terminalGuidance.x
          terminalGuidance1.distance = terminalGuidance.y
          terminalGuidance1.orientation = orientation
          terminalGuidance2.orientation = orientation
          terminalGuidance3.orientation = orientation
        } else {
          terminalGuidance1.show = false
          terminalGuidance2.show = false
          terminalGuidance3.show = false
        }
      }
    )
  }

  return { addFighterRadar, addMissilTerminalGuidance }
}
