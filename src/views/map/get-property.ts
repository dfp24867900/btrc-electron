import { onUnmounted } from 'vue';
import { useMessage } from 'naive-ui';
import _ from 'lodash';
import { queryModelPath } from '@/service/modules/animation';
import Socket from '@/utils/socket';
import { getJson } from '@/service/modules/get-json';
import type {
  ModelPath,
  ModelProperties,
  MapVariables,
  TrackSocketReq,
  PacketTime,
  Properties
} from './cesium/types';

interface Packet extends PacketTime {
  startTime: number;
  endTime: number;
}

const isDevelopment = process.env.NODE_ENV === 'development';
const url = isDevelopment
  ? `ws://192.168.3.94:8764` // 开发环境路径
  : 'ws://192.168.3.94:8764'; // 生产环境本地路径

export function getProperty(
  mapVariables: MapVariables,
  addPropertys: (
    data: Properties,
    planePath: string,
    packet: PacketTime
  ) => Promise<void>,
  initTimeLine: (startTime: number, endTime: number) => void
) {
  const message = useMessage();
  let socket: Socket<TrackSocketReq, ModelProperties> | null;

  // 根据ID查询模型路径
  let modelPathList: ModelPath[] = [];
  const getModelPath = async () => {
    await queryModelPath().then((res: ModelPath[]) => {
      modelPathList = res.map((item) => item);
    });
  };
  const findModelPath = (modelType: string) => {
    return modelPathList.find((item: ModelPath) => {
      return item.modelType === modelType;
    });
  };

  // 记录加载的数据
  const computeTimelineSchedule = (packet: Packet) => {
    let duration = packet.endTime - packet.startTime;
    let left = ((packet.packetStartTime - packet.startTime) / duration) * 100;
    let width = Math.abs(
      ((packet.packetEndTime - packet.packetStartTime) / duration) * 100
    );
    if (left + width > 100) width = 100 - left;

    mapVariables.timelineSchedule?.push({
      left,
      width,
      packetStartTime: packet.packetStartTime,
      packetEndTime: packet.packetEndTime
    });
  };

  // websocket模式
  const initTrackSocket = (gisDataSN: string, batchId: string) => {
    let wsOption = {
      url: `${url}/common-gis/websocket/${gisDataSN}/${batchId}`,
      isReconnect: false,
      openCb: () => {
        message.success('任务数据连接开启');
        sendTrackMessage('HEADER', 'start');
      },
      closeCb: () => {
        message.warning('任务数据连接关闭');
      },
      errorCb: () => {
        message.error('连接服务异常');
      },
      messageCb: receiveMessage
    };
    socket = new Socket(wsOption);
  };

  // 处理socket接收的数据
  const receiveMessage = async (message: ModelProperties) => {
    mapVariables.loadingRef = false;
    // 初始化时间轴
    initTimeLine(message.startTime, message.endTime);
    // 模型添加
    for (let i = 0; i < message.modelPropertiesFull.length; i++) {
      let item = message.modelPropertiesFull[i];
      const modelPath = findModelPath(item.typeId)?.modelPath || '';
      const packet = {
        packetStartTime: message.packetStartTime,
        packetEndTime: message.packetEndTime
      };
      await addPropertys(item, modelPath, packet);
    }
    computeTimelineSchedule(message);
  };

  const sendTrackMessage = _.throttle((msgType: string, msg: string) => {
    if (msgType === 'TIMESTAMP') {
      let time = Number(msg);
      let index = mapVariables.timelineSchedule?.findIndex(
        (item) => item.packetStartTime <= time && item.packetEndTime >= time
      );
      if (index !== -1) return;
    }
    let message: TrackSocketReq = {
      msgType,
      msg
    };
    socket?.send(message);
  }, 500);

  onUnmounted(() => {
    sendTrackMessage('HEADER', 'stop');
    socket?.destroy();
    socket = null;
    cancelLoop = true;
  });

  // 文件模式加载
  let cancelLoop = false;
  const getTaskJson = async (fileList: string[]) => {
    // 多个小文件
    for (let i = 0; i < fileList.length; i++) {
      if (cancelLoop) break;
      await getJson(fileList[i]).then(async (res: ModelProperties) => {
        initTimeLine(res.startTime, res.endTime);
        mapVariables.loadingRef = false;
        for (let j = 0, e = res.modelPropertiesFull.length; j < e; j++) {
          const item2 = res.modelPropertiesFull[j];
          const modelPath = findModelPath(item2.typeId)?.modelPath || '';
          const packet = {
            packetStartTime: res.packetStartTime,
            packetEndTime: res.packetEndTime
          };
          await addPropertys(item2, modelPath, packet);
        }
        computeTimelineSchedule(res);
      });
    }
  };

  return { initTrackSocket, getModelPath, sendTrackMessage, getTaskJson };
}
