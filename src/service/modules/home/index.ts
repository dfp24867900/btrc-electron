import { Service } from '@/service/service';
import prefix from '@/service/prefix';

// 航医
// 获取首页顶部数据
export function getStatistics(): any {
  return Service({
    url: prefix.physiological + '/beltMonitorFile/countNo',
    method: 'get'
  });
}
