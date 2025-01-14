export type Callback = (e: Event) => void
export type MessageCallback<RT> = (e: RT) => void

interface TrackSocketReq {
  msgType: string
  msg: string
}

interface Ioptions<RT> {
  url: string | null // 链接的通道的地址
  heartTime?: number // 心跳时间间隔
  heartMsg?: TrackSocketReq // 心跳信息,默认为'ping'
  isReconnect?: boolean // 是否自动重连
  isRestory?: boolean // 是否销毁
  reconnectTime?: number // 重连时间间隔
  reconnectCount?: number // 重连次数 -1 则不限制
  openCb?: Callback // 连接成功的回调
  closeCb?: Callback // 关闭的回调
  messageCb?: MessageCallback<RT> // 消息的回调
  errorCb?: Callback // 错误的回调
}

/**
 * 心跳基类
 */

export class Heart {
  heartTimeOut!: number // 心跳计时器
  ServerHeartTimeOut!: number // 心跳计时器
  timeout = 30000
  // 重置
  reset(): void {
    clearTimeout(this.heartTimeOut)
    clearTimeout(this.ServerHeartTimeOut)
  }

  /**
   * 启动心跳
   * @param {Function} cb 回调函数
   */
  start(cb: Callback): void {
    this.heartTimeOut = setTimeout((e: Event) => {
      cb(e)
      this.ServerHeartTimeOut = setTimeout((e: Event) => {
        cb(e)
        // 重新开始检测
        this.reset()
        this.start(cb)
      }, this.timeout)
    }, this.timeout)
  }
}

export default class Socket<T, RT> extends Heart {
  ws: WebSocket | null = null

  reconnectTimer = 0 // 重连计时器
  reconnectCount = 10 // 变量保存，防止丢失

  options: Ioptions<RT> = {
    url: null, // 链接的通道的地址
    heartTime: 30000, // 心跳时间间隔
    heartMsg: { msgType: 'HEADER', msg: 'ping' }, // 心跳信息,默认为'ping'
    isReconnect: true, // 是否自动重连
    isRestory: false, // 是否销毁
    reconnectTime: 5000, // 重连时间间隔
    reconnectCount: 5, // 重连次数 -1 则不限制
    openCb: (e: Event) => {
      console.log('连接成功的默认回调::::', e)
    }, // 连接成功的回调
    closeCb: (e: Event) => {
      console.log('关闭的默认回调::::', e)
    }, // 关闭的回调
    messageCb: (e: RT) => {
      console.log('连接成功的默认回调::::', e)
    }, // 消息的回调
    errorCb: (e: Event) => {
      console.log('错误的默认回调::::', e)
    } // 错误的回调
  }

  constructor(ops: Ioptions<RT>) {
    super()
    Object.assign(this.options, ops)
    this.create()
  }

  /**
   * 建立连接
   */
  create(): void {
    if (!('WebSocket' in window)) {
      console.log('当前浏览器不支持，无法使用')
      return
    }
    if (!this.options.url) {
      console.log('地址不存在，无法建立通道')
      return
    }
    // this.ws = null
    this.ws = new WebSocket(this.options.url)
    this.onopen(this.options.openCb as Callback)
    this.onclose(this.options.closeCb as Callback)
    this.onmessage(this.options.messageCb as MessageCallback<RT>)
  }

  /**
   * 自定义连接成功事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onopen(callback: Callback): void {
    if (!this.ws) return
    this.ws.onopen = (event) => {
      clearTimeout(this.reconnectTimer) // 清除重连定时器
      this.options.reconnectCount = this.reconnectCount // 计数器重置
      // 建立心跳机制
      // super.reset()
      // super.start(() => {
      //   this.send(this.options.heartMsg as TrackSocketReq)
      // })
      if (typeof callback === 'function') {
        callback(event)
      } else {
        typeof this.options.openCb === 'function' && this.options.openCb(event)
      }
    }
  }

  /**
   * 自定义关闭事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onclose(callback: Callback): void {
    if (!this.ws) return
    this.ws.onclose = (event) => {
      // super.reset()
      !this.options.isRestory && this.onreconnect()
      if (typeof callback === 'function') {
        callback(event)
      } else {
        typeof this.options.closeCb === 'function' &&
          this.options.closeCb(event)
      }
    }
  }

  /**
   * 自定义错误事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onerror(callback: Callback): void {
    if (!this.ws) return
    this.ws.onerror = (event) => {
      if (typeof callback === 'function') {
        callback(event)
      } else {
        typeof this.options.errorCb === 'function' &&
          this.options.errorCb(event)
      }
    }
  }

  /**
   * 自定义消息监听事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onmessage(callback: MessageCallback<RT>): void {
    if (!this.ws) return
    this.ws.onmessage = (event: MessageEvent<string>) => {
      const strMessage = event.data
      if (strMessage === 'pong') return
      const data = JSON.parse(strMessage)
      // super.reset()
      // super.start(() => {
      //   this.send(this.options.heartMsg as TrackSocketReq)
      // })
      if (typeof callback === 'function') {
        callback(data)
      } else {
        typeof this.options.messageCb === 'function' &&
          this.options.messageCb(data)
      }
    }
  }

  /**
   * 自定义发送消息事件
   * @param {String} data 发送的文本
   */
  send(data: T | TrackSocketReq | string): void {
    if (!this.ws) return
    if (this.ws.readyState !== this.ws.OPEN) {
      console.log('没有连接到服务器，无法推送')
      return
    }
    data = JSON.stringify(data)
    this.ws.send(data)
  }

  /**
   * 连接事件
   */
  onreconnect(): void {
    if (
      (this.options.reconnectCount as number) > 0 ||
      this.options.reconnectCount === -1
    ) {
      this.reconnectTimer = setTimeout(() => {
        this.create()
        if (this.options.reconnectCount !== -1)
          (this.options.reconnectCount as number)--
      }, this.options.reconnectTime)
    } else {
      clearTimeout(this.reconnectTimer)
      this.options.reconnectCount = this.reconnectCount
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    if (!this.ws) return
    // super.reset()
    clearTimeout(this.reconnectTimer) // 清除重连定时器
    this.ws.close()
    this.options.isRestory = true
    this.ws = null
  }
}
