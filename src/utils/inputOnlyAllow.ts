// 只允许输入数字
const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value)

export default onlyAllowNumber
