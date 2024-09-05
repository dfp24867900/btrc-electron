import { reactive } from 'vue';
import * as Cesium from 'cesium';
import _ from 'lodash';
import { useDateFormatter } from './components/date-formatter';
import { addProperties } from './components/add-properties';
import { initModel } from './components/init-model';
import prefix from '@/service/prefix';
import type {
  MapVariables,
  Properties,
  PacketTime,
  ClockMessageType,
  MapOption,
  MapSetting
} from './types';

const isDevelopment = process.env.NODE_ENV === 'development';
const tileUrl = isDevelopment
  ? prefix.gisResource + `/map/{z}/{x}/{y}.png` // 开发环境路径
  : 'file:///E:/BTRC/hy-resources/map/wp/{z}/{x}/{y}.png'; // 生产环境本地路径
const terrainUrl = isDevelopment
  ? prefix.gisResource + `/tiles/` // 开发环境路径
  : 'file:///E:/BTRC/hy-resources/map/gc'; // 生产环境本地路径

let viewer: any = null;
export function useCesium(mapOption: MapOption, mapSetting: MapSetting) {
  const mapVariables = reactive({
    loadingRef: false,
    mapOption: mapOption,
    startTime: 0,
    endTime: 0,
    activePilotId: 0,
    activeModelId: '',
    isFirstPerson: false,
    firstPerson: { heading: 0, pitch: 0, roll: 0, height: 0 },
    timelineSchedule: []
  } as MapVariables);

  // 跟随视角 模型切换
  let firstPersonModel: any = null; // 第一人称模型
  const trackedEntityChange = (modelId: string, type?: string) => {
    const entity = viewer.entities.getById(modelId);
    if (mapVariables.mapOption?.viewingType !== 3) {
      if (entity?.show) {
        if (mapVariables.isFirstPerson) {
          viewer.trackedEntity = undefined;
          firstPersonModel = entity;
        } else {
          firstPersonModel = null;
          viewer.trackedEntity = entity;
        }
      } else {
        viewer.trackedEntity = undefined;
        firstPersonModel = null;
        mapVariables.isFirstPerson = false;
        viewer.zoomTo(viewer.entities);
      }
    }
    if (type === 'plane') return;
    mapVariables.activeModelId = modelId;
    modelFocus(modelId);
  };

  // 重置视角
  const thirdPerson = () => {
    if (firstPersonModel) {
      mapVariables.isFirstPerson = false;
      viewer.trackedEntity = firstPersonModel;
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
      firstPersonModel = null;
    } else {
      viewer.trackedEntity = undefined;
      mapVariables.activeModelId = '';
      mapVariables.activePilotId = 0;
      viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(0, -90, 0));
    }
  };

  // 切换视图模式二维、三维
  const changeSceneMode = (value: number) => {
    thirdPerson();
    viewer.scene.mode = value;
  };

  // 鼠标操作
  const initHandler = () => {
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    // 左键按下事件-移动标签
    handler.setInputAction((e: { position: Cesium.Cartesian2 }) => {
      const pick = viewer.scene.pick(e.position);
      if (
        Cesium.defined(pick) &&
        pick.primitive instanceof Cesium.Label &&
        pick.id?.type == 'model'
      ) {
        viewer.scene.screenSpaceCameraController.enableRotate = false; // 将相机锁定，不然后续移动实体时相机也会动
        // 注册鼠标拖拽事件
        viewer.screenSpaceEventHandler.setInputAction(
          (arg: {
            startPosition: Cesium.Cartesian2;
            endPosition: Cesium.Cartesian2;
          }) => {
            if (
              arg.endPosition.x < 0 ||
              arg.endPosition.x > viewer._lastWidth ||
              arg.endPosition.y < 0 ||
              arg.endPosition.y > viewer._lastHeight
            )
              return;
            let distance = Cesium.Cartesian2.subtract(
              arg.endPosition,
              arg.startPosition,
              new Cesium.Cartesian2()
            );
            pick.id.label.pixelOffset._value = Cesium.Cartesian2.add(
              distance,
              pick.id.label.pixelOffset._value,
              new Cesium.Cartesian2()
            );
          },
          Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );
        // 绑定鼠标抬起事件
        viewer.screenSpaceEventHandler.setInputAction(() => {
          //为viewer绑定LEFT_UP事件监听器（执行函数，监听的事件）
          viewer.scene.screenSpaceCameraController.enableRotate = true; // 取消相机锁定
          viewer.screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
          ); // 解除viewer的MOUSE_MOVE事件监听器
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
      } // 如果点击空白区域，则不往下执行
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    // 清除左键双击
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );

    // 右键点击事件
    handler.setInputAction((e: { position: Cesium.Cartesian2 }) => {
      const pick = viewer.scene.pick(e.position);
      // 点击空白区域
      if (!Cesium.defined(pick) || pick.id?.type !== 'model') return;
      pick.id.label.show._value = !pick.id.label.show._value;
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    // 左键点击事件
    handler.setInputAction((e: { position: Cesium.Cartesian2 }) => {
      const pick = viewer.scene.pick(e.position);
      // 点击空白区域
      if (
        viewer.scene.mode !== 3 ||
        !Cesium.defined(pick) ||
        pick.id?.type !== 'model'
      )
        return;
      mapVariables.isFirstPerson = false;
      trackedEntityChange(pick.id.id, 'plane');
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    // ALT左键事件
    handler.setInputAction(
      (e: { position: Cesium.Cartesian2 }) => {
        const pick = viewer.scene.pick(e.position);
        // 点击空白区域
        if (
          viewer.scene.mode !== 3 ||
          !Cesium.defined(pick) ||
          pick.id?.type !== 'model'
        )
          return;
        mapVariables.isFirstPerson = true;
        trackedEntityChange(pick.id.id, 'plane');
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
      Cesium.KeyboardEventModifier.ALT
    );
  };

  // 第一人称视角
  const lookAt = () => {
    let position: Cesium.Cartesian3 | undefined;
    let orientation: Cesium.Quaternion;
    let transform: Cesium.Matrix4 | undefined;
    let mtx3: Cesium.Matrix3;
    let mtx4: Cesium.Matrix4;
    let hpr: Cesium.HeadingPitchRoll;
    return (scene: Cesium.Scene, time: Cesium.JulianDate) => {
      if (firstPersonModel && mapVariables.isFirstPerson) {
        position = firstPersonModel.position?.getValue(time);
        orientation = firstPersonModel.orientation?.getValue(time);
        if (orientation && position) {
          transform = Cesium.Matrix4.fromRotationTranslation(
            Cesium.Matrix3.fromQuaternion(orientation),
            position
          ); //将偏向角转为3*3矩阵，利用实时点位转为4*4矩阵
          viewer.camera.lookAtTransform(
            transform,
            new Cesium.Cartesian3(0.001, 0, 0)
          );

          mtx3 = Cesium.Matrix3.fromQuaternion(orientation);
          mtx4 = Cesium.Matrix4.fromRotationTranslation(
            mtx3,
            position,
            new Cesium.Matrix4()
          );
          hpr = Cesium.Transforms.fixedFrameToHeadingPitchRoll(mtx4);
          // console.log(Cesium.Math.toDegrees(hpr.heading))
          // 第一视角航向角
          mapVariables.firstPerson.heading = Cesium.Math.toDegrees(hpr.heading);
          mapVariables.firstPerson.pitch = Cesium.Math.toDegrees(hpr.pitch);
          mapVariables.firstPerson.roll = Cesium.Math.toDegrees(hpr.roll);
          mapVariables.firstPerson.height = Math.floor(
            viewer.scene.globe.ellipsoid.cartesianToCartographic(position)
              .height
          );
        }

        // const position = firstPersonModel.position?.getValue(time)
        // const hpr = firstPersonModel.hprProperty?.getValue(time)
        // const orientation = firstPersonModel.orientation?.getValue(time)

        // if (!position && !hpr && !orientation) return
        // const transform = Cesium.Matrix4.fromRotationTranslation(
        //   Cesium.Matrix3.fromQuaternion(orientation),
        //   position
        // ) //将偏向角转为3*3矩阵，利用实时点位转为4*4矩阵
        // viewer.camera.lookAtTransform(
        //   transform,
        //   new Cesium.Cartesian3(0.001, 0, 0)
        // )
        // mapVariables.firstPerson.heading = hpr.x - 360
        // mapVariables.firstPerson.pitch = hpr.y
        // mapVariables.firstPerson.roll = hpr.z
        // mapVariables.firstPerson.height = Math.floor(
        //   viewer.scene.globe.ellipsoid.cartesianToCartographic(position)
        //     .height
        // )
      }
    };
  };

  // 回放模式地图初始化
  const { dateFormatter } = useDateFormatter();
  const initPlaybackMap = (id: string, fullscreenId?: string) => {
    viewer = new Cesium.Viewer(id, {
      sceneModePicker: false, // 图层选择器
      navigationHelpButton: false, // 帮助按钮
      geocoder: false, //查找位置工具
      homeButton: false, // 视角返回初始位置
      fullscreenButton: mapVariables.mapOption?.fullscreenButton, //全屏
      animation: false, //动画器件，控制播放速度
      timeline: mapVariables.mapOption?.timeline, //时间线
      vrButton: false,
      shadows: false,
      shouldAnimate: false,
      baseLayerPicker: false,
      infoBox: false,
      fullscreenElement: fullscreenId,
      msaaSamples: 4,
      scene3DOnly: true,
      skyBox: false,
      creditContainer: undefined, // 禁用默认的 ion credit
      // showRenderLoopErrors: false,
      requestRenderMode: false, // 显式渲染
      // 瓦片
      imageryProvider: new Cesium.UrlTemplateImageryProvider({
        // url: prefix.gisResource + `/map/{z}/{x}/{y}.png`,
        url: tileUrl, // 替换为你的本地瓦片路径
        minimumLevel: 1,
        maximumLevel: 18
      }),
      // 高程
      terrainProvider: new Cesium.CesiumTerrainProvider({
        // url: prefix.gisResource + `/tiles/`
        url: terrainUrl // 替换为你的本地路径
      })
    });
    viewer.selectionIndicator.destroy();

    viewer.scene.screenSpaceCameraController.enableCollisionDetection = true; // 禁止相机进入地下
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 50000000; // 缩放时相机位置的最小幅度
    viewer.scene.light = new Cesium.DirectionalLight({
      direction: new Cesium.Cartesian3(0.354925, -0.890918, -0.283358)
    });

    viewer.scene.fxaa = true; // 关闭抗锯齿
    viewer.scene.postProcessStages.fxaa.enabled = true;
    viewer.scene.debugShowFramesPerSecond = true; // 显示帧率
    viewer.cesiumWidget.creditContainer.innerHTML = '';
    window.viewer = viewer;

    // 日期时间格式化
    mapVariables.mapOption?.timeline && dateFormatter(viewer);

    // 锁定框
    let selectionIndicatorContainer = document.getElementsByClassName(
      'cesium-viewer-selectionIndicatorContainer'
    ); //cesium 地图选择后cesium创建的一个框
    selectionIndicator = new Cesium.SelectionIndicator(
      selectionIndicatorContainer[0],
      viewer.scene
    );

    mapVariables.mapOption?.viewingType !== 3 &&
      viewer.scene.preUpdate.addEventListener(lookAt());

    // 添加鼠标事件
    initHandler();

    // // 请求阿里DataV上的数据
    // const jsonData = `https://geo.datav.aliyun.com/areas_v3/bound/440000_full.json`
    // // jsonData一定要json文件

    // const geoJSON = Cesium.GeoJsonDataSource.load(jsonData, {
    //   stroke: Cesium.Color.fromCssColorString('#00fcff'),
    //   fill: Cesium.Color.fromCssColorString('#ffffff').withAlpha(0.0),
    //   strokeWidth: 3,
    //   markerSymbol: '?'
    // })
    // viewer.dataSources.add(geoJSON)

    return viewer;
  };

  // 初始化回放模式时间轴
  let firstInitTimeline = true;
  const initTimeLine = (startTime: number, endTime: number) => {
    if (!firstInitTimeline) return;
    firstInitTimeline = false;
    const start = Cesium.JulianDate.fromDate(new Date(startTime));
    const stop = Cesium.JulianDate.fromDate(new Date(endTime));
    viewer.clock.startTime = start.clone(); //设置开始时间
    mapVariables.mapOption?.timeline && viewer.timeline.zoomTo(start, stop); // 绑定时间线
    if (
      Cesium.JulianDate.compare(viewer.clock.currentTime, stop) > 0 ||
      Cesium.JulianDate.compare(viewer.clock.currentTime, start) < 0
    ) {
      viewer.clock.currentTime = start.clone();
    }
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //循环播放
    viewer.clock.stopTime = stop.clone(); //设置结束时间
  };

  // 添加模型
  const { initPlaybackModel } = initModel(mapVariables, mapSetting);

  // 添加轨迹、姿态
  const { addTimesToProperties } = addProperties();

  // 添加模型、轨迹、姿态
  const addPropertys = async (
    { modelId, properties, modelEvents, FJDZH, FJLX }: Properties,
    planePath: string,
    packet: PacketTime
  ) => {
    const entity = viewer.entities.getById(modelId);

    // 默认参数值
    const defaultProps = {
      showProperty: new Cesium.TimeIntervalCollectionProperty(),
      position: new Cesium.SampledPositionProperty(),
      hprProperty: new Cesium.SampledPositionProperty(),
      orientation: new Cesium.SampledProperty(Cesium.Quaternion),
      emiEvent: new Cesium.SampledProperty(Cesium.Cartesian4),
      events: new Cesium.SampledProperty(Cesium.Cartesian3),
      radiusColor: new Cesium.SampledProperty(Cesium.Cartesian4),
      radarAngle: new Cesium.SampledProperty(Cesium.Cartesian4),
      terminalGuidance: new Cesium.SampledProperty(Cesium.Cartesian4),
      radarStation: new Cesium.SampledProperty(Cesium.Cartesian4),
      label1_4: new Cesium.SampledProperty(Cesium.Cartesian4),
      label5_8: new Cesium.SampledProperty(Cesium.Cartesian4)
    };

    const {
      showProperty,
      position,
      hprProperty,
      orientation,
      emiEvent,
      events,
      radiusColor,
      radarAngle,
      terminalGuidance,
      radarStation,
      label1_4,
      label5_8
    } = entity || defaultProps;

    if (!entity) {
      initPlaybackModel(
        viewer,
        { modelId, FJDZH, FJLX },
        {
          showProperty,
          position,
          hprProperty,
          orientation,
          emiEvent,
          events,
          radiusColor,
          radarAngle,
          terminalGuidance,
          radarStation,
          label1_4,
          label5_8
        },
        planePath,
        modelEvents
      );
    }

    // 更新属性
    await addTimesToProperties(
      properties,
      {
        showProperty,
        position,
        hprProperty,
        orientation,
        emiEvent,
        events,
        radiusColor,
        radarAngle,
        terminalGuidance,
        radarStation,
        label1_4,
        label5_8
      },
      modelEvents,
      packet
    );

    // // 设置插值选项
    // position.setInterpolationOptions({
    //   interpolationDegree: 5,
    //   interpolationAlgorithm: Cesium.HermitePolynomialApproximation
    // })
  };

  // 控制所有标签、轨迹
  const controlLabelPath = (type: string, value: boolean) => {
    if (!viewer) return;
    viewer.entities.values.forEach((item: any) => {
      if (item.type == 'model') {
        item[type].show = value;
      }
    });
  };

  // 模型聚焦动画
  let selectionIndicator: Cesium.SelectionIndicator;
  const modelFocus = (id: string) => {
    let entity = viewer.entities.getById(id);
    if (!Cesium.defined(entity)) return;
    selectionIndicator.viewModel.animateAppear();
    const locking = (clock: { currentTime: Cesium.JulianDate }) => {
      selectionIndicator.viewModel.position = entity.position.getValue(
        clock.currentTime
      ); //把选择的实体的位置付给selectionIndicator
      selectionIndicator.viewModel.showSelection = true;
      selectionIndicator.viewModel.update(); //更新
    };

    viewer.clock.onTick.addEventListener(locking);
    setTimeout(() => {
      viewer.clock.onTick.removeEventListener(locking);
      selectionIndicator.viewModel.animateDepart();
      selectionIndicator.viewModel.position = Cesium.Cartesian3.fromDegrees(
        0,
        0,
        0
      );
      selectionIndicator.viewModel.showSelection = false;
      selectionIndicator.viewModel.update(); //更新
    }, 1000);
  };

  // 控制播放
  const MULTIPLIER_MAX = 4096;
  const MULTIPLIER_MIN = -4096;
  const MULTIPLIER_STEP = 2;
  const controlAnimate = (type: ClockMessageType, time?: number) => {
    const { clock } = viewer;
    switch (type) {
      case 'up':
        if (clock.multiplier > 0) {
          clock.multiplier *= MULTIPLIER_STEP;
        } else {
          clock.multiplier /= MULTIPLIER_STEP;
        }
        if (clock.multiplier < 0 && clock.multiplier > -0.25) {
          clock.multiplier = 0.25;
        }
        if (clock.multiplier >= MULTIPLIER_MAX) {
          clock.multiplier = MULTIPLIER_MAX;
        }
        break;

      case 'down':
        if (clock.multiplier > 0) {
          clock.multiplier /= MULTIPLIER_STEP;
        } else {
          clock.multiplier *= MULTIPLIER_STEP;
        }
        if (clock.multiplier > 0 && clock.multiplier < 0.25) {
          clock.multiplier = -0.25;
        }
        if (clock.multiplier <= MULTIPLIER_MIN) {
          clock.multiplier = MULTIPLIER_MIN;
        }
        break;

      case 'forward':
        clock.currentTime = Cesium.JulianDate.addSeconds(
          clock.currentTime,
          5,
          new Cesium.JulianDate()
        );
        if (Cesium.JulianDate.compare(clock.currentTime, clock.stopTime) > 0) {
          clock.currentTime = clock.stopTime;
        }
        break;

      case 'backward':
        clock.currentTime = Cesium.JulianDate.addSeconds(
          clock.currentTime,
          -5,
          new Cesium.JulianDate()
        );
        if (Cesium.JulianDate.compare(clock.startTime, clock.currentTime) > 0) {
          clock.currentTime = clock.startTime;
        }
        break;

      case 'should':
        clock.shouldAnimate = !clock.shouldAnimate;
        break;

      case 'gotoTime':
        viewer.clock.shouldAnimate = false; // 暂停
        viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(time!));
        break;
      default:
    }
  };

  return {
    mapVariables,
    initPlaybackMap,
    thirdPerson,
    initTimeLine,
    addPropertys,
    changeSceneMode,
    controlAnimate,
    trackedEntityChange
  };
}
