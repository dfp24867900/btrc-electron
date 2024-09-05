import { reactive, onMounted } from 'vue'

import {
  deleteUser_new,
  queryAuthInfoList
} from '@/service/modules/permissions'
import { format } from 'date-fns'
import { parseTime } from '@/common/common'
import type { IRecord, TAuthType } from './types'
import { useMessage } from 'naive-ui'

export function useTable() {
  const Message = useMessage()
  const state = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    searchVal: '',
    list: [],
    loading: false,
    currentRecord: {} as IRecord | null,
    authorizeType: 'authorize_project' as TAuthType,
    detailModalShow: false,
    authorizeModalShow: false,
    //定义角色权限模态框
    roleModalShow: false,
    //定义用户组权限模态框
    uGroupModalShow: false,
    type: ''
  })

  const getList = async () => {
    if (state.loading) return
    state.loading = true

    await queryAuthInfoList('user', {
      pageNo: state.page,
      pageSize: state.pageSize,
      searchVal: state.searchVal
    }).then((res: any) => {
      state.loading = false
      if (!res) throw Error()
      state.list = res.records.map((record: IRecord) => {
        record.createTime = record.createTime
          ? format(parseTime(record.createTime), 'yyyy-MM-dd HH:mm:ss')
          : ''
        record.updateTime = record.updateTime
          ? format(parseTime(record.updateTime), 'yyyy-MM-dd HH:mm:ss')
          : ''
        return record
      })

      state.itemCount = res.total
    })
    state.loading = false
  }

  const updateList = () => {
    if (state.list.length === 1 && state.page > 1) {
      --state.page
    }
    getList()
  }
  const handleSearch = () => {
    state.page = 1
    getList()
  }
  const deleteUserId = async (userId: number) => {
    await deleteUser_new({ id: userId })
    updateList()
    Message.info('操作成功')
  }

  const onOperationClick = (
    data: IRecord,
    type: 'roleAuthorize' | 'uGroupAuthorize' | 'authorize' | 'edit' | 'delete'
  ) => {
    state.currentRecord = data
    state.type = type
    if (type === 'roleAuthorize' || type === 'uGroupAuthorize') {
      state.roleModalShow = true
    }

    if (type === 'edit') {
      state.detailModalShow = true
    }
    if (type === 'delete') {
      if (!data.id) return
      deleteUserId(data.id)
    }
  }

  const changePage = (page: number) => {
    state.page = page
    getList()
  }

  const changePageSize = (pageSize: number) => {
    state.page = 1
    state.pageSize = pageSize
    getList()
  }

  onMounted(() => {
    getList()
  })

  return {
    state,
    changePage,
    changePageSize,
    updateList,
    onOperationClick,
    handleSearch
  }
}
