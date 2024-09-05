import { Service } from '@/service/service'
import prefix from '@/service/prefix'

export function getJson(url: string): any {
  return Service({
    url: prefix.gisResource + '/json/' + url,
    method: 'get'
  })
}
