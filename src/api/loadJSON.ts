export const loadJSON = () => {
  const data = localStorage.getItem('json')
  return data && JSON.parse(data)
}
