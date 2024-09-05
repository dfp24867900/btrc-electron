const formatDuring = (mss: number) => {
  let days = Math.floor(mss / (1000 * 60 * 60 * 24))
  let hours = Math.floor((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = Math.floor((mss % (1000 * 60 * 60)) / (1000 * 60))
  let seconds = Math.floor((mss % (1000 * 60)) / 1000)

  let dayString = days + ' 天 '
  let hourString = hours + ' 小时 '
  let minuteString = minutes + ' 分钟 '
  let secondString = seconds + ' 秒 '

  return `${days > 0 ? dayString : ''}${hours > 0 ? hourString : ''}${
    minutes > 0 ? minuteString : ''
  }${secondString}`
}

export default formatDuring
