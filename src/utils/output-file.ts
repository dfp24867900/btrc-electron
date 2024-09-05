const outputFile = (name: string, data: string, type: 'txt' | 'json') => {
  let filename = name
  let blob = new Blob([data], { type: 'text/json' })
  let a = document.createElement('a')
  a.download = filename + '.' + type
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
  const event = new MouseEvent('click')
  a.dispatchEvent(event)
}

export default outputFile

// 使用
// utils.outputFile('name', JSON.stringify(data), 'json')
