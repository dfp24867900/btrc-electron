import type {
  TableColumns,
  InternalRowData
} from 'naive-ui/es/data-table/src/interface'
import { RoleReq } from '@/service/modules/permissions/types'
export type { RoleInfoRes } from '@/service/modules/permissions/types'

type TUserType = 'GENERAL_USER' | ''
type TAuthType =
  | 'authorize_project'
  | 'authorize_resource'
  | 'authorize_datasource'
  | 'authorize_udf'
  | 'authorize_namespace'
  | 'authorize_member'
  | 'authorize_task'

interface IRecord {
  id: number
  roleName: string
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
  RoleReq,
  TableColumns,
  InternalRowData
}
