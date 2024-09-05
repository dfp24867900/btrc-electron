import { defineComponent, toRefs } from 'vue'
import {
  NButton,
  NInput,
  NIcon,
  NSpace,
  NDataTable,
  NPagination
} from 'naive-ui'
import Card from '@/components/card'
import UsergroupDetailModal from './components/usergroup-detail-modal'
import { useI18n } from 'vue-i18n'
import { SearchOutlined } from '@vicons/antd'
import { useColumns } from './use-columns'
import { useTable } from './use-table'
import RoleAuthorizeModal from './components/role-authorize-modal'
import { MAX_LENGTH_LIMIT } from '@/common/length-limit'

const UsergroupManage = defineComponent({
  name: 'usergroup-manage',
  setup() {
    const { t } = useI18n()
    const {
      state,
      changePage,
      changePageSize,
      updateList,
      onOperationClick,
      handleSearch
    } = useTable()
    const { columnsRef } = useColumns(onOperationClick)

    const onAddUsergroup = () => {
      state.detailModalShow = true
      state.currentRecord = null
    }
    const onDetailModalCancel = () => {
      state.detailModalShow = false
    }
    const onAuthorizeModalCancel = () => {
      state.authorizeModalShow = false
    }
    const onRoleModalCancel = () => {
      state.roleModalShow = false
    }

    const onUpdatedList = () => {
      state.roleModalShow = false
      updateList()
    }

    return {
      t,
      columnsRef,
      ...toRefs(state),
      changePage,
      changePageSize,
      onAddUsergroup,
      onUpdatedList,
      onHandleSearch: handleSearch,
      onDetailModalCancel,
      onAuthorizeModalCancel,
      onRoleModalCancel
    }
  },
  render() {
    return (
      <>
        <NSpace vertical>
          <Card>
            <NSpace justify='space-between'>
              <NButton
                onClick={this.onAddUsergroup}
                type='primary'
                class='btn-create-user'
                size='small'
              >
                {'创建用户组'}
              </NButton>
              <NSpace>
                <NInput
                  v-model:value={this.searchVal}
                  clearable
                  size='small'
                  placeholder={'请输入关键字'}
                  maxlength={MAX_LENGTH_LIMIT.text}
                />
                <NButton
                  type='primary'
                  onClick={this.onHandleSearch}
                  size='small'
                >
                  <NIcon>
                    <SearchOutlined />
                  </NIcon>
                </NButton>
              </NSpace>
            </NSpace>
          </Card>
          <Card>
            <NSpace vertical>
              <NDataTable
                row-class-name='items'
                columns={this.columnsRef.columns}
                data={this.list}
                loading={this.loading}
                scrollX={this.columnsRef.tableWidth}
                striped
              />
              <NSpace justify='center'>
                <NPagination
                  v-model:page={this.page}
                  v-model:page-size={this.pageSize}
                  item-count={this.itemCount}
                  show-size-picker
                  page-sizes={[10, 30, 50]}
                  show-quick-jumper
                  on-update:page={this.changePage}
                  on-update:page-size={this.changePageSize}
                />
              </NSpace>
            </NSpace>
          </Card>
        </NSpace>
        <UsergroupDetailModal
          show={this.detailModalShow}
          currentRecord={this.currentRecord}
          onCancel={this.onDetailModalCancel}
          onUpdate={this.onUpdatedList}
        />

        <RoleAuthorizeModal
          show={this.roleModalShow}
          type={this.type}
          currentRecord={this.currentRecord}
          onCancel={this.onRoleModalCancel}
          onUpdate={this.onUpdatedList}
        />
      </>
    )
  }
})

export default UsergroupManage
