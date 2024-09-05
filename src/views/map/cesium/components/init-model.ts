import _ from 'lodash';
import * as Cesium from 'cesium';
import prefix from '@/service/prefix';
import { useGeometry } from './geometry-primitive';
import { addParticleSystem } from './use-particle-system';
import type { Propertys, MapVariables, MapSetting } from '../types';

export function initModel(mapVariables: MapVariables, mapSetting: MapSetting) {
  const { addFighterRadar, addMissilTerminalGuidance } = useGeometry(
    mapVariables,
    mapSetting
  );

  // 初始化模型
  const initPlaybackModel = async (
    viewer: any,
    {
      modelId: id,
      FJDZH,
      FJLX
    }: { modelId: string; FJDZH: string; FJLX: string },
    propertys: Propertys,
    planePath: string,
    modelEvents: string[]
  ) => {
    removeModel(viewer, id);
    // 标签变量
    let lat, lng, alt, speed, xl, hxl, heading, pitch, roll, fxgz, bs;
    console.log(
      FJDZH,
      FJLX,
      lat,
      lng,
      alt,
      speed,
      xl,
      hxl,
      heading,
      pitch,
      roll,
      fxgz,
      bs
    );
    // 模型
    const modelEntity: any = viewer.entities.add({
      id: id,
      type: 'model',
      // show: true,
      show: new Cesium.CallbackProperty((time) => {
        return !!propertys.showProperty.getValue(time);
      }, false),
      viewFrom: new Cesium.Cartesian3(0, 1500, 1500),
      ...propertys,
      model: {
        uri: prefix.gisResource + `/planemodel/${planePath}`, //飞机模型
        scale: 10,
        minimumPixelSize: 60,
        shadows: false,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          10,
          Number.MAX_VALUE
        ),
        silhouetteColor: Cesium.Color.LIGHTGREEN,
        silhouetteSize: new Cesium.CallbackProperty(() => {
          return mapVariables.activeModelId == id ? 2 : 0;
        }, false)
      },
      path: {
        show: true,
        leadTime: 0,
        trailTime: 10,
        width: 20,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.25,
          taperPower: 0.6,
          color: Cesium.Color.fromBytes(0, 255, 255, 100)
        }),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 80000)
      },
      label: {
        type: 'label',
        show: false,
        pixelOffset: new Cesium.Cartesian2(50, -50),
        text: new Cesium.CallbackProperty((time) => {
          if (!modelEntity.show) return;
          let hpr: Cesium.Cartesian4 = propertys.label1_4.getValue(time);
          heading = hpr?.x.toFixed(1) || '';
          pitch = hpr?.y.toFixed(1) || '';
          roll = hpr?.z.toFixed(1) || '';
          let fxgz_bs: Cesium.Cartesian4 = propertys.label5_8.getValue(time);
          fxgz = fxgz_bs?.x.toFixed(1) || '';
          bs = fxgz_bs?.y.toFixed(1) || '';
          let position = propertys.position.getValue(time);
          if (position) {
            let cartographic =
              viewer.scene.globe.ellipsoid.cartesianToCartographic(position);
            lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
            lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
            alt = cartographic.height.toFixed(2);
          }
          let str = '`编号：${id}\n机型：${FJLX}\n代字代号：${FJDZH}';
          if (!!mapSetting.labelEvalStr) {
            str = str + '\n' + mapSetting.labelEvalStr + '`';
          } else {
            str = str + '`';
          }
          return eval(str);
        }, false),
        // font: '15pt monospace', // 15pt monospace
        scale: 0.45,
        fillColor: Cesium.Color.BLACK,
        showBackground: true,
        backgroundColor: new Cesium.Color(1, 1, 1, 0.3),
        backgroundPadding: new Cesium.Cartesian2(30, 30),
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          10,
          1000000
        )
      },
      // 连线
      polyline: {
        show: new Cesium.CallbackProperty((time) => {
          return modelEntity.label.show._value;
        }, false),
        width: 1,
        positions: new Cesium.CallbackProperty((time) => {
          if (!modelEntity.show) return;
          let startPosition = propertys.position.getValue(time);
          if (startPosition) {
            try {
              let cartesian2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                viewer.scene,
                startPosition
              );
              let distance = Cesium.Cartesian2.add(
                cartesian2,
                modelEntity.label.pixelOffset._value,
                new Cesium.Cartesian2()
              );
              let endPosition = viewer.scene.globe.pick(
                viewer.camera.getPickRay(distance),
                viewer.scene
              );
              if (startPosition && endPosition) {
                return [startPosition, endPosition];
              }
            } catch {}
          }
        }, false),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          5,
          1000000
        )
      }
    });

    // 模型显隐
    // viewer.scene.preUpdate.addEventListener(
    //   (scene: Cesium.Scene, time: Cesium.JulianDate) => {
    //     modelEntity.show = !!propertys.showProperty.getValue(time)
    //   }
    // )

    // 特效
    if (mapVariables.mapOption?.specialEffects) {
      for (let i = 0; i < modelEvents.length; i++) {
        switch (modelEvents[i]) {
          // 命中
          case 'FIGHTER_FIGHTERHIT':
            {
              const boxEntity = viewer.entities.add({
                id: id + '_box',
                show: false,
                parent: modelEntity,
                position: propertys.position,
                orientation: propertys.orientation,
                box: {
                  dimensions: new Cesium.Cartesian3(300.0, 200.0, 150.0),
                  fill: true,
                  material: new Cesium.Color(0, 0, 0, 0.5),
                  outline: true,
                  outlineColor: Cesium.Color.DIMGREY,
                  outlineWidth: 1
                }
              });
              const fireAnimateSystem = addParticleSystem(viewer, modelEntity, {
                translation: { x: -20, y: 0, z: 20 },
                options: {
                  startColor: Cesium.Color.RED.withAlpha(1),
                  endColor: Cesium.Color.YELLOW.withAlpha(0.8),
                  particleLife: 0.4,
                  speed: 1,
                  startScale: 0.2,
                  endScale: 2,
                  emissionRate: 10,
                  lifetime: 0.2,
                  sizeInMeters: true,
                  imageSize: new Cesium.Cartesian2(40, 40),
                  emitter: new Cesium.CircleEmitter(0.5)
                }
              });
              viewer.scene.preUpdate.addEventListener(
                (scene: Cesium.Scene, time: Cesium.JulianDate) => {
                  if (!modelEntity.show) return;
                  let events = propertys.events.getValue(time);
                  if (!events || !fireAnimateSystem) return;

                  if (
                    !events.z ||
                    !mapSetting.effectShowRef['FIGHTER_FIGHTERHIT']
                  ) {
                    fireAnimateSystem.show = false;
                    fireAnimateSystem.emissionRate = 0;
                  } else {
                    fireAnimateSystem.show = true;
                    fireAnimateSystem.emissionRate = 10;
                  }
                  if (!boxEntity) return;
                  boxEntity.show =
                    events.z && mapSetting.effectShowRef['FIGHTER_FIGHTERHIT']; // 命中显示盒子
                }
              );
            }
            break;

          // 电磁干扰
          case 'FIGHTER_EMI':
            {
              const emi_left_bottom = viewer.entities.add({
                id: id + '_emi_left_bottm',
                show: false,
                position: propertys.position,
                orientation: propertys.orientation,
                model: {
                  uri: prefix.gisResource + `/planemodel/emi_left_bottom.glb`,
                  scale: 120,
                  minimumPixelSize: 50,
                  shadows: false,
                  silhouetteColor: Cesium.Color.LIGHTGREEN,
                  silhouetteSize: 0,
                  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    10,
                    100000
                  )
                }
              });
              const emi_right_bottom = viewer.entities.add({
                id: id + '_emi_right_bottom',
                show: false,
                position: propertys.position,
                orientation: propertys.orientation,
                model: {
                  uri: prefix.gisResource + `/planemodel/emi_right_bottom.glb`,
                  scale: 120,
                  minimumPixelSize: 60,
                  shadows: false,
                  silhouetteColor: Cesium.Color.LIGHTGREEN,
                  silhouetteSize: 0,
                  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    10,
                    100000
                  )
                }
              });
              const emi_right_top = viewer.entities.add({
                id: id + '_emi_right_top',
                show: false,
                position: propertys.position,
                orientation: propertys.orientation,
                model: {
                  uri: prefix.gisResource + `/planemodel/emi_right_top.glb`,
                  scale: 120,
                  minimumPixelSize: 60,
                  shadows: false,
                  silhouetteColor: Cesium.Color.LIGHTGREEN,
                  silhouetteSize: 0,
                  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    10,
                    100000
                  )
                }
              });
              const emi_left_top = viewer.entities.add({
                id: id + '_emi_left_top',
                show: false,
                position: propertys.position,
                orientation: propertys.orientation,
                model: {
                  uri: prefix.gisResource + `/planemodel/emi_left_top.glb`,
                  scale: 120,
                  minimumPixelSize: 60,
                  shadows: false,
                  silhouetteColor: Cesium.Color.LIGHTGREEN,
                  silhouetteSize: 0,
                  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    10,
                    100000
                  )
                }
              });

              let silhouette = true;
              viewer.scene.preUpdate.addEventListener(
                _.throttle((scene: Cesium.Scene, time: Cesium.JulianDate) => {
                  if (!modelEntity.show) return;
                  let emi_event = propertys.emiEvent.getValue(time);
                  if (emi_event) {
                    let show = mapSetting.effectShowRef['FIGHTER_EMI'];
                    emi_left_top.show = emi_event.x && show;
                    emi_left_bottom.show = emi_event.y && show;
                    emi_right_top.show = emi_event.z && show;
                    emi_right_bottom.show = emi_event.w && show;
                    if (!viewer.clock.shouldAnimate && !show) return;
                    silhouette = !silhouette;
                    emi_left_bottom.model.silhouetteSize = silhouette ? 3 : 0;
                    emi_right_bottom.model.silhouetteSize = silhouette ? 3 : 0;
                    emi_right_top.model.silhouetteSize = silhouette ? 3 : 0;
                    emi_left_top.model.silhouetteSize = silhouette ? 3 : 0;
                  } else {
                    emi_left_top.show = false;
                    emi_left_bottom.show = false;
                    emi_right_top.show = false;
                    emi_right_bottom.show = false;
                  }
                }, 100)
              );
            }
            break;

          // 加力
          case 'FIGHTER_AFTERBURNER':
            {
              const particleSystem = addParticleSystem(viewer, modelEntity, {
                translation: { x: 105, y: 0, z: 10 },
                options: {
                  startColor: Cesium.Color.fromCssColorString(
                    'rgba(255, 150, 0, 1)'
                  ),
                  endColor: Cesium.Color.WHITE.withAlpha(0.0),
                  startScale: 15,
                  endScale: 3,
                  particleLife: 0.4,
                  speed: 0,
                  emissionRate: 60,
                  lifetime: 0.2,
                  sizeInMeters: true,
                  emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(15.0)) //锥形发射器
                }
              });

              viewer.scene.preUpdate.addEventListener(
                (scene: Cesium.Scene, time: Cesium.JulianDate) => {
                  if (!modelEntity.show) return;
                  let events = propertys.events.getValue(time);
                  if (!events || !particleSystem) return;
                  if (
                    !events.x ||
                    !mapSetting.effectShowRef['FIGHTER_AFTERBURNER']
                  ) {
                    particleSystem.show = false;
                    particleSystem.emissionRate = 0;
                  } else {
                    particleSystem.show = true;
                    particleSystem.emissionRate = 60;
                  }
                }
              );
            }
            break;

          // 红外干扰
          case 'FIGHTER_IRCM':
            {
              const jammingBombSystem = addParticleSystem(viewer, modelEntity, {
                translation: {
                  x: 105,
                  y: 0,
                  z: 10
                },
                options: {
                  startColor: Cesium.Color.RED.withAlpha(1),
                  endColor: Cesium.Color.WHITE.withAlpha(0.0),
                  minimumParticleLife: 2,
                  maximumParticleLife: 5,
                  speed: -5,
                  startScale: 15,
                  endScale: 5,
                  emissionRate: 10,
                  lifetime: 0.2,
                  sizeInMeters: true,
                  emitter: new Cesium.CircleEmitter(50.0) //圆形发射器
                }
              });
              viewer.scene.preUpdate.addEventListener(
                (scene: Cesium.Scene, time: Cesium.JulianDate) => {
                  if (!modelEntity.show) return;
                  let events = propertys.events.getValue(time);
                  if (!events || !jammingBombSystem) return;
                  if (!events.y || !mapSetting.effectShowRef['FIGHTER_IRCM']) {
                    jammingBombSystem.show = false;
                    jammingBombSystem.emissionRate = 0;
                  } else {
                    jammingBombSystem.show = true;
                    jammingBombSystem.emissionRate = 10;
                  }
                }
              );
            }
            break;

          // 添加雷达
          case 'FIGHTER_FIXED_RADAR':
            addFighterRadar(viewer, propertys, id, modelEntity);
            break;

          // 添加末端制导
          case 'MISSIL_TERMINAL_GUIDANCE':
            addMissilTerminalGuidance(viewer, propertys, id, modelEntity);
            break;
          default:
            break;
        }
      }

      // 地面雷达
      // viewer.scene.preUpdate.addEventListener(
      //   _.throttle((scene: Cesium.Scene, time: Cesium.JulianDate) => {
      //     if (modelEvents.includes('RADAR_STATION_COVER_RADAR')) {
      //       let radarStation = propertys.radarStation.getValue(time)
      //       let polylineVolume = viewer.entities.getById(id + '_polylineVolume')
      //       let radarSurface = viewer.entities.getById(id + '_radarSurface')

      //       if (radarStation && radarStation.x > 0) {
      //         const color = Cesium.Color.fromBytes(
      //           radarStation.y,
      //           radarStation.z,
      //           radarStation.w,
      //           70
      //         )
      //         const outlineColor = Cesium.Color.fromBytes(
      //           radarStation.y,
      //           radarStation.z,
      //           radarStation.w,
      //           100
      //         )

      //         if (!polylineVolume && !radarSurface) {
      //           const position = propertys.position.getValue(time)
      //           if (position) {
      //             let cartographic =
      //               viewer.scene.globe.ellipsoid.cartesianToCartographic(
      //                 position
      //               )
      //             let lat = Cesium.Math.toDegrees(cartographic.latitude)
      //             let lng = Cesium.Math.toDegrees(cartographic.longitude)
      //             let alt = cartographic.height
      //             const groundRadar = addGroundRadar(viewer, {
      //               id,
      //               position: [lng, lat, alt],
      //               radius: radarStation.x,
      //               color,
      //               outlineColor,
      //               speed: 1
      //             })
      //             polylineVolume = groundRadar.radarRange
      //             radarSurface = groundRadar.radarScan
      //           }
      //         }
      //         polylineVolume && (polylineVolume.show = true)
      //         radarSurface && (radarSurface.show = true)
      //       } else {
      //         polylineVolume && (polylineVolume.show = false)
      //         radarSurface && (radarSurface.show = false)
      //       }
      //     }
      //   }, 200)
      // )
    }
  };

  // 删除模型
  const removeModel = (viewer: Cesium.Viewer, id: string) => {
    viewer.entities.removeById(id);
    viewer.entities.removeById(id + '_emi_left_bottm');
    viewer.entities.removeById(id + '_emi_right_bottom');
    viewer.entities.removeById(id + '_emi_left_top');
    viewer.entities.removeById(id + '_emi_right_top');
    viewer.entities.removeById(id + '_polylineVolume');
    viewer.entities.removeById(id + '_radarSurface');
  };

  return { initPlaybackModel };
}
