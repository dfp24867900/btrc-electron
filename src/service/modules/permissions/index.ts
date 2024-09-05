import { Service } from '@/service/service';
import { UsergroupReq } from './types';
import {
  UsergroupIdReq,
  UserReq_new,
  IdReq,
  ListReq,
  UsergroupNameReq,
  RoleReq,
  RoleIdReq
} from './types';
import prefix from '../../prefix';

// 获取用户信息
export function getUserInfo(): any {
  let params = { query: 'menu' };
  return Service({
    // url: prefix.authorize + '/user/get-user-info',
    url: prefix.authorize + '/user/self/info',
    method: 'get',
    params
  });
}

//权限查询
export function queryUserList(params: ListReq): any {
  return Service({
    url: prefix.authorize + '/user/all',
    method: 'get',
    params
  });
}

//创建用户
export function createUser_new(data: UserReq_new): any {
  return Service({
    url: prefix.authorize + '/user',
    method: 'post',
    data
  });
}
//用户更新
export function updateUser_new(data: UserReq_new): any {
  return Service({
    url: prefix.authorize + '/user',
    method: 'put',
    data
  });
}
//根据用户名查询用户
export function queryUserByName(params: UserReq_new): any {
  return Service({
    url: prefix.authorize + `/user/name/${params.userName}`,
    method: 'get',
    params
  });
}
//根据用户ID查询用户
export function queryUserById(params: IdReq): any {
  return Service({
    url: prefix.authorize + `user/ids/${params.id}`,
    method: 'get',
    params
  });
}

//删除用户
export function deleteUser_new(params: IdReq) {
  return Service({
    url: prefix.authorize + `/user/${params.id}`,
    method: 'delete',
    params
  });
}

//查询用户组列表接口
export function queryUsergroupListAll_new(): any {
  return Service({
    url: prefix.authorize + '/group/all',
    method: 'get'
  });
}
//分页查询用户组
export function queryUsergroupList(params: ListReq): any {
  return Service({
    url: prefix.authorize + '/group/all',
    method: 'get',
    params
  });
}

//创建用户组
export function createUsergroup_new(data: UsergroupReq): any {
  return Service({
    url: prefix.authorize + '/group',
    method: 'post',
    data
  });
}
//更新用户组
export function updateUsergroup_new(data: IdReq & UsergroupReq): any {
  return Service({
    url: prefix.authorize + '/group',
    method: 'put',
    data
  });
}
//根据用户组id查询
export function queryUsergroupById(data: UsergroupIdReq): any {
  return Service({
    url: prefix.authorize + `/group/${data.id}`,
    method: 'get',
    data
  });
}

//根据用户组名查询
export function queryUsergroupByName(data: UsergroupNameReq): any {
  return Service({
    url: prefix.authorize + `/group/name/${data.groupName}`,
    method: 'get',
    data
  });
}

//根据用户组id删除
export function delUsergroupById(params: UsergroupIdReq) {
  return Service({
    url: prefix.authorize + `/group/${params.id}`,
    method: 'delete',
    params
  });
}

//角色
//角色列表查询
export function queryRoleListAll(): any {
  return Service({
    url: prefix.authorize + '/role/all',
    method: 'get'
  });
}
//分页查询角色列表
export function queryRoleList(params: ListReq): any {
  return Service({
    url: prefix.authorize + '/role/all',
    method: 'get',
    params
  });
}
//创建角色
export function createRole(data: RoleReq): any {
  return Service({
    url: prefix.authorize + '/role',
    method: 'post',
    data
  });
}
//删除
export function deleteRoleById(params: RoleIdReq): any {
  return Service({
    url: prefix.authorize + `/role/${params.roleId}`,
    method: 'delete',
    params
  });
}
//更新
export function updateRole(data: IdReq & RoleReq): any {
  return Service({
    url: prefix.authorize + '/role',
    method: 'put',
    data
  });
}
//根据角色id查询
export function queryRoleById(params: IdReq): any {
  return Service({
    url: prefix.authorize + `/role/${params.id}`,
    method: 'get',
    params
  });
}

// 用户、用户组、角色  对应权限所属查询
export function queryAuthList(type: 'user' | 'group' | 'role'): any {
  return Service({
    url: prefix.authorize + `/${type}/all`,
    method: 'get'
  });
}
// 用户、用户组、角色  对应类型所属权限查询
export function queryAuthHasList(
  currType: 'user' | 'group' | 'role',
  currTypeId: any,
  type: 'users' | 'groups' | 'roles'
) {
  return Service({
    url: prefix.authorize + `/${currType}/${currTypeId}/${type}`,
    method: 'get'
  });
}
//用户，用户组，角色，对应类型所属权限更新
export function updateAuthList(
  currType: 'user' | 'group' | 'role',
  currTypeId: any,
  // type: "users" | "groups" | "roles", data: any) {
  type: any,
  data: any
) {
  return Service({
    url: prefix.authorize + `/${currType}/${currTypeId}/${type}`,
    method: 'put',
    data
  });
}

// 用户、用户组、角色 列表查询接口合并
export function queryAuthInfoList(
  type: 'user' | 'group' | 'role',
  params: ListReq
): any {
  return Service({
    url: prefix.authorize + `/${type}/all`,
    method: 'get',
    params
  });
}
//权限资源模块
export function querySiedType(data: number): any {
  return Service({
    url: prefix.authorize + '/auth/type',
    method: 'get',
    data
  });
}
export function queryresourceType_new(params: any): any {
  return Service({
    url:
      prefix.authorize +
      `/auth/type/name/${params.type}/resourceType?appSystemId=${params.appSystemId}`,
    method: 'get'
  });
}
// export function queryresourceType_all(params: any): any {
//   return Service({
//     url: `/auth/type/id/${params.entitytypeId}/resourceType?appSystemId=${params.resourceTypeId}`,
//     method: 'get'
//   })
// }
//权限类型
export function queryAllResourceType(params: any): any {
  return Service({
    url: prefix.authorize + `/auth/type/id/${params.entitytypeId}/resourceType`
  });
}
//资源列表查询
export function queryresourceList_new(params: any): any {
  return Service({
    url:
      prefix.authorize +
      `/auth/type/id/${params.entitytypeId}/resource/type/id/${params.resourceTypeId}/resource`,
    method: 'get'
  });
}
//某个项目的所有权限
export function queryAuth_all(params: any): any {
  return Service({
    url:
      prefix.authorize +
      `/auth/type/id/${params.entitytypeId}/resource/type/id/${params.resourceTypeId}/perms`,
    method: 'get'
  });
}
//点击资源列表，查询对应的权限
export function queryAuthClickResource(params: any): any {
  return Service({
    url:
      prefix.authorize +
      `/auth/type/id/${params.entitytypeId}/entity/id/${
        params.rowid
      }/resource/type/id/${params.resourceTypeId}/entity/id/${
        params.listId
      }/perm?list=${true}`,
    method: 'get'
  });
}
//权限更改
// export function updateAuthValue(params: any): any {
//   return Service({
//     url: `/auth/type/id/${params.entitytypeId}/entity/id/${params.rowid}/resource/type/id/${params.resourceTypeId}/entity/id/${params.listId}/perm/${params.perms}`,
//     method: 'put',
//     params
//   })
// }
export function updateAuthValue(data: any): any {
  return Service({
    url:
      prefix.authorize +
      `/auth/type/id/${data.entitytypeId}/entity/id/${data.rowid}/resource/type/id/${data.resourceTypeId}/entity/id/${data.listId}/perm/${data.perms}`,
    method: 'put',
    data
  });
}

//用户，用户组，角色，对应类型所属权限更新
export function updateAuthList_new(
  currType: 'user' | 'group' | 'role',
  currTypeId: number | undefined,
  // type: "users" | "groups" | "roles", data: any) {
  type: string,
  data: any
) {
  return Service({
    url: prefix.authorize + `/auth/base/${currType}/${currTypeId}/${type}s`,
    method: 'put',
    data
  });
}
