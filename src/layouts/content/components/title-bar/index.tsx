import { defineComponent, PropType } from 'vue';
import { NMenu, NDropdown, NButton, NIcon, NSpace } from 'naive-ui';
import { MenuOutlined } from '@vicons/antd';
import { CloneRegular } from '@vicons/fa';
import Logo from '../logo';
import Theme from '../theme';

// const props = {
//   value: {
//     type: String as PropType<string>,
//     default: ''
//   }
// };

export default defineComponent({
  name: 'title-bar',
  //   props,
  setup() {
    return {};
  },

  render() {
    return (
      <NSpace>
        <Logo></Logo>
        <NSpace>
          <Theme></Theme>
          <NButton text focusable={false}>
            <NIcon>
              <CloneRegular />
            </NIcon>
          </NButton>
          <NButton text focusable={false}>
            <NIcon>
              <CloneRegular />
            </NIcon>
          </NButton>
          <NButton text focusable={false}>
            <NIcon>
              <CloneRegular />
            </NIcon>
          </NButton>
        </NSpace>
      </NSpace>
    );
  }
});
