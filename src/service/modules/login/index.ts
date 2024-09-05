import { Service } from '@/service/service'
import { LoginReq } from './types'
import prefix from '../../prefix'

export function login(data: LoginReq): any {
  return Service({
    url: prefix.authorize + '/login',
    method: 'post',
    data
  })
}
