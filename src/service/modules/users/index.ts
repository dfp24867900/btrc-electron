import { Service } from '@/service/service'
import { UserReq, IdReq, ListAllReq } from './types'

import prefix from '../../prefix'

export function listAll(params?: ListAllReq): any {
  return Service({
    url: prefix.authorize + '/user/list-all',
    method: 'get',
    params
  })
}

export function updateUser(data: IdReq & UserReq) {
  return Service({
    url: prefix.authorize + '/user/update',
    method: 'post',
    data
  })
}
