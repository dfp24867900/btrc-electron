import * as Cesium from 'cesium'
import type { SourceItem, PacketTime, Propertys } from '../types'
import utils from '@/utils'

export function addProperties() {
  let total = 0
  let initCamera = false
  const addTimesToProperties = async (
    source: SourceItem[] = [],
    propertys: Propertys,
    modelEvents: string[],
    packet: PacketTime
  ) => {
    // 添加时间点的位置、角度、事件
    let afterburnerState = 0 // 加力状态
    let ircmState = 0 // 红外干扰状态
    let hitState = 0 // 命中状态

    // 电磁干扰
    let emiState = {
      downLeft: 0,
      downRight: 0,
      upLeft: 0,
      upRight: 0
    }

    // 机载雷达
    let airborneRadar = {
      radius: 0, // 半径
      destAngleAzimuth: 0, // 方位角
      destAnglePitch: 0, // 俯仰角
      transverseAngle: 0, // 水平范围
      verticalAngle: 0, // 垂直范围
      colorRed: 0,
      colorGreen: 0,
      colorBlue: 0
    }
    // 末端制导
    let terminalGuidance = {
      open: 0,
      destAngleAzimuth: 0,
      destAnglePitch: 0,
      distance: 1
    }
    // 地面雷达
    let radarStation = {
      colorRed: 0,
      colorGreen: 0,
      colorBlue: 0,
      radius: 0
    }

    let l = source.length
    if (l > 1 && source[0].timeStamp && source[l - 1].timeStamp) {
      let firstPacketTime = source[0].timeStamp
      let lastPacketTime = source[l - 1].timeStamp
      // 检查数据包是否覆盖整个时间范围
      const timeIntervals = []
      if (
        Math.abs(packet.packetStartTime - firstPacketTime) < 500 &&
        Math.abs(packet.packetEndTime - lastPacketTime) < 500
      ) {
        timeIntervals.push(
          new Cesium.TimeInterval({
            start: Cesium.JulianDate.fromDate(new Date(firstPacketTime)),
            stop: Cesium.JulianDate.fromDate(new Date(lastPacketTime)),
            data: true
          })
        )
      } else {
        // 为数据包未覆盖的每个时间段创建间隔
        // 前段未包含
        if (Math.abs(packet.packetStartTime - firstPacketTime) > 500) {
          timeIntervals.push(
            new Cesium.TimeInterval({
              start: Cesium.JulianDate.fromDate(
                new Date(packet.packetStartTime)
              ),
              stop: Cesium.JulianDate.fromDate(new Date(firstPacketTime)),
              data: false
            })
          )
        }

        // 后段未包含
        if (Math.abs(packet.packetEndTime - lastPacketTime) > 500) {
          timeIntervals.push(
            new Cesium.TimeInterval({
              start: Cesium.JulianDate.fromDate(new Date(lastPacketTime)),
              stop: Cesium.JulianDate.fromDate(new Date(packet.packetEndTime)),
              data: false
            })
          )
        }

        timeIntervals.push(
          new Cesium.TimeInterval({
            start: Cesium.JulianDate.fromDate(
              new Date(Math.max(packet.packetStartTime, firstPacketTime))
            ),
            stop: Cesium.JulianDate.fromDate(
              new Date(Math.min(packet.packetEndTime, lastPacketTime))
            ),
            data: true
          })
        )
      }

      timeIntervals.forEach((timeInterval) => {
        propertys.showProperty.intervals.addInterval(timeInterval)
      })
    } else {
      const timeInterval = new Cesium.TimeInterval({
        start: Cesium.JulianDate.fromDate(new Date(packet.packetStartTime)),
        stop: Cesium.JulianDate.fromDate(new Date(packet.packetEndTime)),
        data: false
      })
      propertys.showProperty.intervals.addInterval(timeInterval)
    }

    if (l == 0) return
    for (let i = 0; i < l; i++) {
      // 计数、限速
      total++
      if (total % 1000 == 0) await utils.timeout(20)

      const item: SourceItem = source[i]
      if (!item.timeStamp) continue
      const time = Cesium.JulianDate.fromDate(
        new Date(item.timeStamp),
        new Cesium.JulianDate()
      )

      // 初始视口位置
      if (!initCamera) {
        initCamera = true
        window.viewer?.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            item.longitude / 1,
            item.latitude / 1,
            200000.0
          ),
          orientation: {
            heading: 0,
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
          }
        })
      }

      const position = Cesium.Cartesian3.fromDegrees(
        item.longitude / 1,
        item.latitude / 1,
        item.altitude / 1
      )
      // 添加位置，和时间对应
      propertys.position.addSample(time, position)
      propertys.orientation.addSample(
        time,
        Cesium.Transforms.headingPitchRollQuaternion(
          position,
          new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(item.courseAngle / 1 + 90),
            Cesium.Math.toRadians(item.pitchAngle / -1),
            Cesium.Math.toRadians(item.rollAngle / -1)
          )
        )
      )

      const hpr = new Cesium.Cartesian3(
        item.courseAngle / 1 + 90,
        item.pitchAngle / -1,
        item.rollAngle / -1
      )
      propertys.hprProperty.addSample(time, hpr)

      // 标签
      try {
        propertys.label1_4.addSample(
          time,
          new Cesium.Cartesian4(
            item.courseAngle,
            item.pitchAngle,
            item.rollAngle,
            1
          )
        )
        propertys.label5_8.addSample(
          time,
          new Cesium.Cartesian4(
            item.labelText?.fxgz || 0,
            item.labelText?.bs || 0,
            1,
            1
          )
        )
      } catch (e) {
        console.log(e)
      }

      for (const evt of item.events) {
        switch (evt.eventType) {
          case 'FIGHTER_AFTERBURNER':
            // 加力
            afterburnerState = evt.open
            break
          case 'FIGHTER_IRCM':
            // 红外干扰
            ircmState = evt.open
            break
          case 'FIGHTER_FIGHTERHIT':
            // 命中
            hitState = evt.open
            break
          default:
            break
        }
      }

      const hasModelEvent = modelEvents.some((evt) =>
        ['FIGHTER_AFTERBURNER', 'FIGHTER_IRCM', 'FIGHTER_FIGHTERHIT'].includes(
          evt
        )
      )
      if (hasModelEvent) {
        propertys.events?.addSample(
          time,
          new Cesium.Cartesian3(afterburnerState, ircmState, hitState)
        )
      }

      // 电磁干扰
      if (modelEvents.findIndex((a: string) => a == 'FIGHTER_EMI') != -1) {
        const emi = item.events.find((item: { eventType: string }) => {
          return item.eventType === 'FIGHTER_EMI'
        })
        if (emi) {
          emiState.downLeft = emi.context.downLeftOpen
          emiState.downRight = emi.context.downRightOpen
          emiState.upLeft = emi.context.upLeftOpen
          emiState.upRight = emi.context.upRightOpen
        }
        propertys.emiEvent?.addSample(
          time,
          new Cesium.Cartesian4(
            emiState.upLeft,
            emiState.downLeft,
            emiState.upRight,
            emiState.downRight
          )
        )
      }

      // 机载雷达
      if (modelEvents.includes('FIGHTER_FIXED_RADAR')) {
        const airborneRadarEvent = item.events.find(
          (item: { eventType: string }) => {
            return item.eventType === 'FIGHTER_FIXED_RADAR'
          }
        )
        if (airborneRadarEvent) {
          airborneRadar = {
            ...airborneRadarEvent.context
          }

          airborneRadar.radius = airborneRadarEvent.open
            ? airborneRadar.radius
            : 1
        }
        // 机载雷达半径、颜色
        propertys.radiusColor?.addSample(
          time,
          new Cesium.Cartesian4(
            airborneRadar.radius,
            airborneRadar.colorRed,
            airborneRadar.colorGreen,
            airborneRadar.colorBlue
          )
        )
        // 机载雷达角度、范围
        propertys.radarAngle?.addSample(
          time,
          new Cesium.Cartesian4(
            airborneRadar.destAngleAzimuth,
            airborneRadar.destAnglePitch,
            airborneRadar.transverseAngle,
            airborneRadar.verticalAngle
          )
        )
      }

      // 末端制导
      if (modelEvents.includes('MISSIL_TERMINAL_GUIDANCE')) {
        const terminalGuidanceEvent = item.events.find(
          (item: { eventType: string }) => {
            return item.eventType === 'MISSIL_TERMINAL_GUIDANCE'
          }
        )
        if (terminalGuidanceEvent) {
          terminalGuidance = {
            ...terminalGuidanceEvent.context,
            open: terminalGuidanceEvent.open
          }
        }
        propertys.terminalGuidance?.addSample(
          time,
          new Cesium.Cartesian4(
            terminalGuidance.open,
            terminalGuidance.distance,
            terminalGuidance.destAngleAzimuth,
            terminalGuidance.destAnglePitch
          )
        )
      }

      // 地面雷达
      if (
        modelEvents.findIndex(
          (a: string) => a == 'RADAR_STATION_COVER_RADAR'
        ) != -1
      ) {
        const radarStationEvent = item.events.find(
          (item: { eventType: string }) => {
            return item.eventType === 'RADAR_STATION_COVER_RADAR'
          }
        )
        if (radarStationEvent) {
          radarStation.radius = radarStationEvent.open
            ? radarStationEvent.context.radius || radarStation.radius
            : 0
          radarStation.colorRed =
            Number(radarStationEvent.context?.colorRed) || radarStation.colorRed
          radarStation.colorGreen =
            Number(radarStationEvent.context?.colorGreen) ||
            radarStation.colorGreen
          radarStation.colorBlue =
            Number(radarStationEvent.context?.colorBlue) ||
            radarStation.colorBlue
        }
        propertys.radarStation?.addSample(
          time,
          new Cesium.Cartesian4(
            radarStation.radius,
            radarStation.colorRed,
            radarStation.colorGreen,
            radarStation.colorBlue
          )
        )
      }
    }

    propertys.position.setInterpolationOptions({
      interpolationDegree: 2,
      interpolationAlgorithm: Cesium.HermitePolynomialApproximation
    })
  }

  return { addTimesToProperties }
}
