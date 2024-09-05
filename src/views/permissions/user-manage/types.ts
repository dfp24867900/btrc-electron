import type {
  TableColumns,
  InternalRowData
} from 'naive-ui/es/data-table/src/interface'
import { UserReq } from '@/service/modules/users/types'
export type { UserInfoRes } from '@/service/modules/users/types'

type TUserType = 'GENERAL_USER' | ''
type TAuthType =
  | 'authorize_project'
  | 'authorize_resource'
  | 'authorize_datasource'
  | 'authorize_udf'
  | 'authorize_namespace'
  | 'uGroupAuthorize'
  | 'roleAuthorize'

interface IRecord {
  id?: number
  userName: string
  userPassword: string
  fixUserPassword: string
  email: string
  phone: string
  state: 0 | 1
  createTime?: string
  updateTime?: string
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
  UserReq,
  TableColumns,
  InternalRowData
}
