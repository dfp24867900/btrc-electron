import { onUnmounted } from 'vue';
import _ from 'lodash';
import * as Cesium from 'cesium';
import { useMessage } from 'naive-ui';
import Socket from '@/utils/socket';
import utils from '@/utils';
import type {
  MapVariables,
  ClockSocketRes,
  ClockMessageType
} from './cesium/types';

const isDevelopment = process.env.NODE_ENV === 'development';
const url = isDevelopment
  ? `ws://192.168.3.94:8764` // 开发环境路径
  : 'ws://192.168.3.94:8764'; // 生产环境本地路径

export function useClockSocket(
  mapVariables: MapVariables,
  operationCamera: (modelId: string, pilotId: number) => void,
  sendTrackMessage: (msgType: string, msg: string) => void
) {
  const message = useMessage();

  let socket: Socket<ClockSocketRes, ClockSocketRes> | null;
  const connectClocksync = (batchId: string) => {
    // 无同步权限 不连接同步socket
    if (
      (!mapVariables.mapOption?.synchronousSending &&
        !mapVariables.mapOption?.synchronousReception) ||
      (mapVariables.mapOption?.synchronousSending &&
        mapVariables.mapOption?.synchronousReception)
    )
      return;
    let num = utils.batchId();
    let wsOption = {
      url: `${url}/common-gis/websocketEdit/${batchId}/${num}`,
      isReconnect: false,
      openCb: () => {
        message.success('同步开启');
      },
      closeCb: () => {
        message.warning('同步关闭');
      },
      errorCb: () => {
        message.error('同步异常');
      },
      messageCb: receiveMessage
    };
    socket = new Socket(wsOption);
  };

  const sendSyncMessage = (
    type: ClockMessageType, // 视角锁定修改
    time?: number
  ) => {
    if (!socket || !mapVariables.mapOption?.synchronousSending) return; // 无发送同步权限
    if (socket.ws?.readyState === socket.ws?.OPEN) {
      let message = {
        messageType: type,
        shouldAnimate: window.viewer.clock.shouldAnimate, // 是否播放
        time:
          time ??
          Cesium.JulianDate.toDate(window.viewer.clock.currentTime).getTime(), // 当前时间
        multiplier: window.viewer.clock.multiplier, // 播放速率
        pilotId: mapVariables.activePilotId,
        modelId: mapVariables.activeModelId
      };
      socket.send(message);
    }
  };

  // 处理消息
  const handleMessage = (message: ClockSocketRes) => {
    if (!window.viewer) return;
    window.viewer.clock.currentTime = Cesium.JulianDate.fromDate(
      new Date(message.time)
    );
    window.viewer.clock.shouldAnimate = message.shouldAnimate;
    window.viewer.clock.multiplier = message.multiplier;
  };

  // 接收消息
  let isFirstInit = true;
  const receiveMessage = (message: ClockSocketRes) => {
    if (!mapVariables.mapOption?.synchronousReception) return; // 无接收同步权限

    // 第一次接收
    if (isFirstInit) {
      handleMessage(message);
      isFirstInit = false;
    }

    if (message.messageType !== 'realtime') {
      // 实时数据不处理
      handleMessage(message);
    }

    // 模型切换
    if (message.messageType === 'view') {
      operationCamera(message.modelId, message.pilotId);
    }

    // 时间跳转
    if (message.messageType === 'gotoTime') {
      sendTrackMessage('TIMESTAMP', String(message.time));
    }
  };

  onUnmounted(() => {
    // 断开websocket
    socket?.destroy();
    socket = null;
  });

  return {
    connectClocksync,
    sendSyncMessage
  };
}
