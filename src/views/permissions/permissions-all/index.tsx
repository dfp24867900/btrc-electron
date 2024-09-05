import { h, defineComponent, ref, Ref, reactive, watch, onMounted } from 'vue'
import { stringifyQuery, useRoute, useRouter } from 'vue-router'
import Card from '@/components/card'
import {
  NSpace,
  NButton,
  NCheckbox,
  NCheckboxGroup,
  NGrid,
  NGi,
  useMessage,
  NCard,
  NMenu,
  NEmpty,
  NSpin
} from 'naive-ui'
import Styles from './index.module.scss'
import type { MenuOption } from 'naive-ui'
import { NScrollbar } from 'naive-ui/es/_internal'
import { useI18n } from 'vue-i18n'
import {
  queryresourceList_new,
  queryAllResourceType,
  queryAuthClickResource,
  updateAuthValue
} from '@/service/modules/permissions'

interface ICheckBox {
  label: string
  value: number | string
}

export const AuthorizePatch = defineComponent({
  name: 'permissions-index',

  setup() {
    const t = useI18n()
    const message = useMessage()
    const router = useRouter()
    const route = useRoute()
    const type = `${
      route.query.type === 'user'
        ? '用户'
        : route.query.type === 'role'
        ? '角色'
        : '用户组'
    }`
    const entitytypeId = `${
      route.query.type === 'user' ? 1 : route.query.type === 'group' ? 2 : 3
    }`
    const userName = route.query.name
    const onBack = () => {
      router.go(-1)
    }

    // 选中信息
    const variables = reactive({
      activeTypeRef: ref(''),
      activeListRef: ref(''),
      activeAuthorizeRef: ref([]) as Ref<(number | string)[]>,
      authorizeTypeLoading: false,
      authorizeListLoading: false,
      proAuthorizeLoading: false,
      update: false,
      // 修改的权限列表
      changeAuthList: ref([]) as Ref<
        {
          activeTypeRef: string // 权限类型
          activeListRef: String // 资源名称
          activeAuthorizeRef: (number | string)[] // 权限值
        }[]
      >
    })

    // 权限类型列表
    const authorizeType: Ref<MenuOption[]> = ref([])
    const handleTypeMenuClick = (value: string) => {
      variables.activeListRef = ''
      proAuthorize.value = []
      variables.activeTypeRef = value
      getResourceList()
    }

    // 权限列表
    const authorizeList: Ref<MenuOption[]> = ref([])
    const handleListMenuClick = (value: string) => {
      // 获取权限类型对应的资源详情
      variables.activeListRef = value
      getAuthResource()
    }

    // 权限详情列表
    const proAuthorize = ref([]) as Ref<ICheckBox[]>
    // 修改权限
    const authorizeChange = async (value: (number | string)[]) => {
      let permSum = 0
      value.map((item: string | number) => {
        permSum += Number(item)
      })
      await updataAuth(permSum)
      await getAuthResource()
    }

    onMounted(() => {
      getResourceTypeList()
    })

    // 获取资源类型列表
    const getResourceTypeList = () => {
      variables.authorizeTypeLoading = true
      queryAllResourceType({ entitytypeId }).then((res: any) => {
        authorizeType.value =
          res?.map((item: { description: string; id: number }) => {
            return { label: item.description, key: String(item.id) }
          }) || []
        if (authorizeType.value.length > 0) {
          variables.activeTypeRef = String(authorizeType.value[0].key)
          handleTypeMenuClick(variables.activeTypeRef)
        }
        variables.authorizeTypeLoading = false
      })
    }

    // 获取权限列表
    const getResourceList = () => {
      variables.authorizeListLoading = true
      // 调动获取权限列表的接
      queryresourceList_new({
        entitytypeId,
        resourceTypeId: variables.activeTypeRef
      }).then((res: any) => {
        authorizeList.value =
          res.list?.map((item: { id: string; name: string }) => {
            return { label: item.name, key: item.id }
          }) || []
        proAuthorize.value =
          res.perms?.map((item: { perm: string; displayName: string }) => {
            return {
              label: item.displayName,
              value: item.perm
            }
          }) || []
        variables.activeListRef = String(authorizeList.value[0]?.key) || ''
        variables.authorizeListLoading = false
        variables.activeListRef && getAuthResource()
      })
    }

    // 获取权限详情
    const getAuthResource = async () => {
      variables.proAuthorizeLoading = true
      await queryAuthClickResource({
        entitytypeId,
        rowid: route.query.id,
        resourceTypeId: variables.activeTypeRef,
        listId: variables.activeListRef
      }).then((res: any) => {
        variables.activeAuthorizeRef = []
        res?.forEach((item: { checked: boolean; permDefineValue: number }) => {
          if (item.checked) {
            variables.activeAuthorizeRef.push(item.permDefineValue)
          }
        }) || []
        variables.proAuthorizeLoading = false
      })
    }

    // 修改权限
    const updataAuth = async (permSum: number) => {
      variables.update = true
      await updateAuthValue({
        entitytypeId,
        rowid: route.query.id,
        resourceTypeId: variables.activeTypeRef,
        listId: variables.activeListRef,
        perms: permSum
      }).then((res: any) => {
        variables.update = false
        message.success('操作成功')
      })
    }

    return {
      onBack,
      authorizeType,
      authorizeList,
      variables,
      proAuthorize,
      handleTypeMenuClick,
      handleListMenuClick,
      authorizeChange,
      type,
      userName
    }
  },
  render(row: any) {
    return (
      <Card title={`权限管理 - ${this.type} - ${this.userName}`}>
        {{
          default: () => {
            return (
              <NGrid xGap={'12'} cols={'24'}>
                {/* 权限类型 */}
                <NGi span={'6'}>
                  <p class={[Styles.title]}>权限类型</p>
                  <NCard
                    content-style='padding:0;height:100%'
                    class={[Styles.left_card]}
                  >
                    {this.variables.authorizeTypeLoading ? (
                      <NSpin
                        show={this.variables.authorizeTypeLoading}
                        class={[Styles.spin]}
                      ></NSpin>
                    ) : this.authorizeType.length > 0 ? (
                      <NScrollbar style='max-height: 100%'>
                        <NMenu
                          options={this.authorizeType}
                          v-model:value={this.variables.activeTypeRef}
                          onUpdateValue={this.handleTypeMenuClick}
                        ></NMenu>
                      </NScrollbar>
                    ) : (
                      <NEmpty
                        style={{ height: '100%', justifyContent: 'center' }}
                      ></NEmpty>
                    )}
                  </NCard>
                </NGi>
                <NGi span={'18'}>
                  {/* 权限列表 */}
                  <div style={{ height: 'calc(( 60vh - 100px ))' }}>
                    <p class={[Styles.title_submit]}>
                      <p>列表</p>
                    </p>
                    <NCard
                      content-style='padding:0;height:100%'
                      class={[Styles.right_card]}
                    >
                      {this.variables.authorizeListLoading ? (
                        <NSpin
                          show={this.variables.authorizeListLoading}
                          class={[Styles.spin]}
                        ></NSpin>
                      ) : this.authorizeList.length > 0 ? (
                        <NScrollbar style='height: 100%'>
                          <NMenu
                            options={this.authorizeList}
                            v-model:value={this.variables.activeListRef}
                            onUpdateValue={this.handleListMenuClick}
                          ></NMenu>
                        </NScrollbar>
                      ) : (
                        <NEmpty
                          style={{ height: '100%', justifyContent: 'center' }}
                        ></NEmpty>
                      )}
                    </NCard>
                  </div>
                  {/* 权限配置 */}
                  <div style={{ height: 'calc(( 40vh - 80px ))' }}>
                    <p class={[Styles.title_auth]}>权限配置</p>
                    <NCard
                      content-style='padding:0 0 0 32px;height:100%'
                      class={[Styles.right_card]}
                    >
                      {this.variables.proAuthorizeLoading ? (
                        <NSpin
                          show={this.variables.proAuthorizeLoading}
                          class={[Styles.spin]}
                        ></NSpin>
                      ) : this.proAuthorize.length > 0 ? (
                        <NScrollbar style='height: 100%'>
                          <NCheckboxGroup
                            v-model:value={this.variables.activeAuthorizeRef}
                            onUpdate:value={this.authorizeChange}
                            disabled={
                              !this.variables.activeListRef ||
                              this.variables.update
                            }
                          >
                            <NSpace
                              vertical
                              style={'padding:10px 0;'}
                              size={12}
                            >
                              {this.proAuthorize.map((item) => {
                                return (
                                  <NCheckbox
                                    value={item.value}
                                    label={item.label}
                                  ></NCheckbox>
                                )
                              })}
                            </NSpace>
                          </NCheckboxGroup>
                        </NScrollbar>
                      ) : (
                        <NEmpty
                          style={{ height: '100%', justifyContent: 'center' }}
                        ></NEmpty>
                      )}
                    </NCard>
                  </div>
                </NGi>
              </NGrid>
            )
          },
          'header-extra': () => (
            <NButton size='small' type='info' onClick={this.onBack}>
              返回
            </NButton>
          )
        }}
      </Card>
    )
  }
})
export default AuthorizePatch
