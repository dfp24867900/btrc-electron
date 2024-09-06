import * as Cesium from 'cesium';
import { MapOption } from '../types';

interface IFirstPerson {
  heading: number;
  pitch: number;
  roll: number;
  height: number;
}

interface TimelineSchedule extends PacketTime {
  left: number;
  width: number;
}
interface MapVariables {
  loadingRef: boolean;
  mapOption?: MapOption;
  startTime: number;
  endTime: number;
  activePilotId: number;
  activeModelId: string;
  isFirstPerson: boolean;
  firstPerson: IFirstPerson;
  timelineSchedule?: TimelineSchedule[];
}

interface Propertys {
  showProperty: Cesium.TimeIntervalCollectionProperty;
  position: Cesium.SampledPositionProperty;
  hprProperty: Cesium.SampledPositionProperty;
  orientation: Cesium.SampledProperty;
  emiEvent: Cesium.SampledProperty;
  events: Cesium.SampledProperty;
  radiusColor: Cesium.SampledProperty;
  radarAngle: Cesium.SampledProperty;
  terminalGuidance: Cesium.SampledProperty;
  radarStation: Cesium.SampledProperty;
  label1_4: Cesium.SampledProperty;
  label5_8: Cesium.SampledProperty;
}

// 姿态数据
interface TrackSocketReq {
  msgType: string;
  msg: string;
}

interface PacketTime {
  packetStartTime: number;
  packetEndTime: number;
}

interface SourceItem {
  timeStamp: number;
  longitude: number;
  latitude: number;
  altitude: number;
  courseAngle: number;
  pitchAngle: number;
  rollAngle: number;
  events: any[];
  labelText: { fxgz: number; bs: number };
}

interface Properties {
  modelEvents: string[];
  modelId: string;
  properties?: SourceItem[];
  typeId: string;
  FJDZH: string;
  FJLX: string;
}

interface ModelProperties extends PacketTime {
  modelPropertiesFull: Properties[];
  startTime: number;
  endTime: number;
}

interface ModelPath {
  modelType: string;
  modelPath: string;
}

// clock-socket 同步
type ClockMessageType =
  | 'up' // 加速
  | 'down' // 减速
  | 'backward' // 后退
  | 'forward' // 前进
  | 'should' // 暂停/播放
  | 'realtime' // 实时时间
  | 'gotoTime' // 跳转时间
  | 'view'; // 视角锁定修改

interface ClockSocketRes {
  messageType: ClockMessageType;
  shouldAnimate: boolean;
  time: number;
  multiplier: number;
  pilotId: number;
  modelId: string;
}

interface IOption {
  label: string;
  value: string;
}

interface SettingOption {
  title: string;
  defaultValue: boolean;
  type: string;
  show: boolean;
  children?: {
    defaultValue: string[];
    option: IOption[];
  };
}

type Setting = {
  [key in string]: SettingOption;
};

type EffectShow = {
  [key in string]: boolean;
};

interface MapSetting {
  settingShow: boolean;
  settingOption: Setting;
  labelEvalStr: string;
  effectShowRef: EffectShow;
}

export type {
  MapOption,
  MapVariables,
  Propertys,
  // track-socket
  TrackSocketReq,
  ModelProperties,
  PacketTime,
  ModelPath,
  Properties,
  SourceItem,
  // clock-socket
  ClockMessageType,
  ClockSocketRes,
  SettingOption,
  MapSetting,
  Setting
};
