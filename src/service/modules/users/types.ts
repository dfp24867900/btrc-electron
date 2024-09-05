interface UserNameReq {
  userName?: string;
}

interface UserNamesReq {
  userNames?: string;
}

interface AlertGroupIdReq {
  alertgroupId: string;
}

interface UserReq {
  email: string;
  tenantId: number | null;
  userName: string;
  userPassword: string;
  phone?: string;
  queue?: string;
  state?: number;
  timeZone?: string;
}

interface IdReq {
  id: number;
}

interface UserIdReq {
  userId: number;
}

interface GrantDataSourceReq extends UserIdReq {
  datasourceIds: string;
}

interface GrantResourceReq extends UserIdReq {
  resourceIds: string;
}

interface GrantProject extends UserIdReq {
  projectIds: string;
}

interface ProjectCodeReq {
  projectCode: string;
}

interface GrantUDFReq {
  udfIds: string;
}

interface GrantNamespaceReq {
  namespaceIds: string;
}

interface ListAllReq extends UserReq {
  alertGroup?: string;
  createTime?: string;
  id?: number;
  queueName?: string;
  tenantCode?: string;
  updateTime?: string;
  userType?: 'ADMIN_USER' | 'GENERAL_USER';
}

interface ListReq {
  pageNo: number;
  pageSize: number;
  searchVal?: string;
}

interface RegisterUserReq {
  email: string;
  repeatPassword: string;
  userName: string;
  userPassword: string;
}

interface UserInfoRes extends UserReq, IdReq {
  userType: string;
  tenantCode?: any;
  queueName?: any;
  alertGroup?: any;
  createTime: string;
  updateTime: string;
  securityConfigType: 'PASSWORD' | 'LDAP';
}

interface userAuthRes {
  appSystemId: string;
  displayName: string;
  id: string;
  keyWord: string;
  name: string;
  parentId: string;
  typeId: number;
}

interface UserListRes {
  id: number;
  userName: string;
  userPassword: string;
  email: string;
  phone: string;
  userType: string;
  tenantId: number;
  state: number;
  tenantCode?: any;
  queueName?: any;
  alertGroup?: any;
  queue: string;
  createTime: string;
  updateTime: string;
}

export type {
  UserNameReq,
  UserNamesReq,
  AlertGroupIdReq,
  UserReq,
  IdReq,
  UserIdReq,
  GrantDataSourceReq,
  GrantResourceReq,
  GrantProject,
  ProjectCodeReq,
  GrantUDFReq,
  GrantNamespaceReq,
  ListAllReq,
  ListReq,
  RegisterUserReq,
  UserInfoRes,
  UserListRes,
  userAuthRes
};
