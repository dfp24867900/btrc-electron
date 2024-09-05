const removeUselessChildren = (
  list: { children?: []; dirctory?: boolean; disabled?: boolean }[]
) => {
  if (!list.length) return
  list.forEach((item) => {
    if (item.dirctory && item.children?.length === 0) item.disabled = true
    if (!item.children) return
    if (item.children.length === 0) {
      delete item.children
      return
    }
    removeUselessChildren(item.children)
  })
}

export default removeUselessChildren
