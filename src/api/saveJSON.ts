import { ExcelImportedData } from '../utils/types'

export const saveJSON = async (data: ExcelImportedData) => {
  return fetch('https://react-spreadjs-poc-2-default-rtdb.europe-west1.firebasedatabase.app/template-file-1.json', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}
