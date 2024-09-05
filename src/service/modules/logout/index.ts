import { Service } from '@/service/service';
import prefix from '../../prefix';

export function logout(): any {
  return Service({
    url: prefix.authorize + '/signOut',
    method: 'post'
  });
}
