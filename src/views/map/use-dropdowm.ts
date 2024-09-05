import { reactive, nextTick } from 'vue'

export function useDropdown(changeViewMode: boolean = false) {
  const dropdown = reactive({
    showDropdown: false,
    menuX: 0,
    menuY: 0,
    option: [
      {
        label: '重置视角',
        key: 'thirdPerson'
      },
      {
        label: '视图',
        key: 'sceneMode',
        show: changeViewMode,
        children: [
          {
            label: '二维',
            key: '2D'
          },
          {
            label: '三维',
            key: '3D'
          }
        ]
      }
    ]
  })

  // // 选择菜单
  // const dropdownSelect = async (value: string) => {
  //   dropdown.showDropdown = false
  //   switch (value) {
  //     case 'thirdPerson':
  //       thirdPerson()
  //       break
  //     case '2D':
  //       changeSceneMode(2)
  //       break
  //     case '3D':
  //       changeSceneMode(3)
  //       break
  //   }
  // }

  // 右键弹出菜单
  const meunStateChange = (e: MouseEvent) => {
    e.preventDefault()
    dropdown.showDropdown = false
    nextTick().then(() => {
      dropdown.showDropdown = true
      dropdown.menuX = e.clientX
      dropdown.menuY = e.clientY
    })
  }

  const handleClickoutside = () => {
    dropdown.showDropdown = false
  }

  return { dropdown, meunStateChange, handleClickoutside }
}
