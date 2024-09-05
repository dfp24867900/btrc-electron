import { CSSProperties, defineComponent, PropType } from 'vue'
import { NCard } from 'naive-ui'

const headerStyle = {
  borderBottom: '1px solid var(--n-border-color)'
}

const contentStyle = {
  padding: '8px 10px'
}

const headerExtraStyle = {}

const props = {
  title: {
    type: String as PropType<string>
  },
  headerStyle: {
    type: String as PropType<string | CSSProperties>
  },
  headerExtraStyle: {
    type: String as PropType<string | CSSProperties>
  },
  contentStyle: {
    type: String as PropType<string | CSSProperties>
  }
}

const Card = defineComponent({
  name: 'Card',
  props,
  render() {
    const { title, $slots } = this
    return (
      <NCard
        title={title}
        size='small'
        headerStyle={this.headerStyle ? this.headerStyle : headerStyle}
        headerExtraStyle={
          this.headerExtraStyle ? this.headerExtraStyle : headerExtraStyle
        }
        contentStyle={this.contentStyle ? this.contentStyle : contentStyle}
      >
        {$slots}
      </NCard>
    )
  }
})

export default Card
