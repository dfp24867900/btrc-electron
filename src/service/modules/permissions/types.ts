//用户属性
interface UserReq_new {
  id?: number | null
  userName: string
  userPassword: string
  fixUserPassword?: string
  email: string
  phone?: string
  createTime?: string
  updateTime?: string
}
interface IdReq {
  id: number
}

interface UsergroupIdReq {
  id: number
}
interface UsergroupNameReq {
  groupName: string
}
interface UsergroupReq {
  groupId?: number
  groupName: string
  description: string
}
interface UsergroupInfoRes extends UsergroupReq, IdReq {
  createTime: string
  updateTime: string
}
interface ListReq {
  pageNo: number
  pageSize: number
  searchVal?: string
}

interface UserIdReq {
  userId: number
}
interface AuthTypeReq extends UserIdReq {
  authType: string
}
interface IOption {
  value: number | string
  label: string
}
//角色
interface RoleReq {
  roleName: string
  description: string
}
interface RoleNameReq {
  roleName: string
}

interface RoleIdReq {
  roleId: number
}
interface RoleInfoRes extends RoleReq, IdReq {
  createTime: string
  updateTime: string
}

export {
  UsergroupIdReq,
  UserIdReq,
  AuthTypeReq,
  IOption,
  UserReq_new,
  IdReq,
  ListReq,
  UsergroupInfoRes,
  UsergroupReq,
  UsergroupNameReq,
  RoleReq,
  RoleIdReq,
  RoleInfoRes,
  RoleNameReq
}
