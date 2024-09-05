import { defineComponent } from 'vue';
import { NSpace, NButton, NIcon } from 'naive-ui';
import { LineOutlined } from '@vicons/antd';
import styles from './index.module.scss';

const TitleBar = defineComponent({
  name: 'title-bar',
  setup() {
    return {};
  },

  render() {
    return (
      <NSpace class={styles['title-bar']}>
        <div class={styles['title']}>My Custom App</div>
        <NSpace >
          <NButton text>
            <NIcon size={16}>
              <LineOutlined />
            </NIcon>
          </NButton>
          {/* <button id="maximize">[]</button>
          <button id="close">X</button> */}
        </NSpace>
      </NSpace>
    );
  }
});

export default TitleBar;
