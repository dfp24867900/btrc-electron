const batchId = (): string => {
  return `${new Date().getTime().toFixed(0).slice(-7)}${(
    Math.random() * 10000
  ).toFixed(0)}`
}

export default batchId
