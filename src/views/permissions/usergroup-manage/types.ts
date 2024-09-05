import type {
  TableColumns,
  InternalRowData
} from 'naive-ui/es/data-table/src/interface'
// import { UsergroupReq } from '@/service/modules/usergroup/types'
import {
  UsergroupReq,
  IdReq,
  UsergroupIdReq,
  UsergroupInfoRes
} from '@/service/modules/permissions/types'
// export type { UsergroupInfoRes } from '@/service/modules/usergroup/types'

type TUserType = 'GENERAL_USER' | ''
type TAuthType =
  | 'authorize_project'
  | 'authorize_resource'
  | 'authorize_datasource'
  | 'authorize_udf'
  | 'authorize_namespace'
  | 'authorize_member'

interface IRecord {
  id: number
  groupName: string
  description: string
  createTime: string
  updateTime: string
}

interface IResourceOption {
  id: number
  fullName: string
  type: string
}

interface IOption {
  value: number
  label: string
}

export {
  IRecord,
  IResourceOption,
  IOption,
  TAuthType,
  UsergroupReq,
  TableColumns,
  InternalRowData,
  IdReq,
  UsergroupIdReq,
  UsergroupInfoRes
}
