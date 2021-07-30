export const loadJSON = async () => {
  const response = await fetch('https://react-spreadjs-poc-2-default-rtdb.europe-west1.firebasedatabase.app/template-file-1.json')
  const data = await response.json()

  return data
}
