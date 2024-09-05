import { defineComponent, ref, PropType } from 'vue'
import { NLayoutSider, NMenu } from 'naive-ui'
import { useMenuClick } from './use-menuClick'

const Sidebar = defineComponent({
  name: 'Sidebar',
  props: {
    sideMenuOptions: {
      type: Array as PropType<any>,
      default: []
    },
    sideKey: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup() {
    const collapsedRef = ref(false)
    const defaultExpandedKeys = [
      'workflow',
      'task',
      'etl-task',
      'udf-manage',
      'service-manage',
      'statistical-manage',
      'task-group-manage',
      'etl',
      'dataAccess-datasource',
      'dataAccess-structured',
      'dataAccess-semiStructured',
      'dataAccess-unstructured',
      'data-development-offline',
      'data-development-etl',
      'data-development-workflow',
      'dataGovernance-metaDataManage',
      'dataOrganization',
      'data-quality',
      'pilot-company',
      'data-interaction-message',
      'data-interaction-fulltext-search'
    ]

    const { handleMenuClick } = useMenuClick()

    return { collapsedRef, defaultExpandedKeys, handleMenuClick }
  },
  render() {
    return (
      <NLayoutSider
        bordered
        nativeScrollbar={false}
        show-trigger='bar'
        collapse-mode='width'
        collapsed={this.collapsedRef}
        onCollapse={() => (this.collapsedRef = true)}
        onExpand={() => (this.collapsedRef = false)}
      >
        <NMenu
          class='tab-vertical'
          value={this.sideKey}
          options={this.sideMenuOptions}
          defaultExpandedKeys={this.defaultExpandedKeys}
          onUpdateValue={this.handleMenuClick}
        />
      </NLayoutSider>
    )
  }
})

export default Sidebar
