const regex = {
  email: /^[A-Za-z0-9\u4e00-\u9fa5\.]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, // support Chinese mailbox
  phone: /^1\d{10}$/,
  password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
}

export const positiveIntegerRegex = /^\+?[0-9]*$/

export default regex
