const copy = (text: string): boolean => {
  const inp = document.createElement('input')
  document.body.appendChild(inp)
  inp.value = text
  inp.select()
  let result = false
  try {
    result = document.execCommand('copy')
  } catch (err) {}
  inp.remove()
  return result
}

export default copy
