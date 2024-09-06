import { Service } from '@/service/service';

const gisResourceURL = String(import.meta.env.VITE_APP_DEV_GISRESOURCE_URL);
export function getJson(url: string): any {
  return Service({
    url: gisResourceURL + '/json/' + url,
    method: 'get'
  });
}
