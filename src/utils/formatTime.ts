const formatTime = (time: any) => {
  var d = time ? new Date(time) : new Date()
  var year = d.getFullYear() as any
  var month = (d.getMonth() + 1) as any
  var day = d.getDate() as any
  var hours = d.getHours() as any
  var min = d.getMinutes() as any
  var seconds = d.getSeconds() as any

  if (month < 10) month = '0' + month.toString()
  if (day < 10) day = '0' + day
  if (hours < 0) hours = '0' + hours
  if (min < 10) min = '0' + min
  if (seconds < 10) seconds = '0' + seconds

  return hours + ':' + min + ':' + seconds
}

export default formatTime
