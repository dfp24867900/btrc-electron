const trim = (value: string) => {
  return !value.startsWith(' ') && !value.endsWith(' ')
}

export const noSpace = (value: string) => {
  return value.indexOf(' ') === -1
}

export default trim
