interface LoginReq {
  userName: string
  userPassword: string
}

interface SessionIdRes {
  sessionId: string
}

export { LoginReq, SessionIdRes }
