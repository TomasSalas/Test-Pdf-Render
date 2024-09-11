import moment from 'moment'
import ExcelJS from 'exceljs'
import { FormatDate } from './FormatDate'

export const handleFileUpload = async (e, setData) => {
  setData([])
  const file = e.target.files[0]
  if (!file) return

  try {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(arrayBuffer)

    const worksheet = workbook.worksheets[0]
    const jsonData = []

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return // Omitir el encabezado

      const rowData = {}
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        let cellValue = cell.value

        const header = worksheet.getRow(1).getCell(colNumber).value

        if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
          if (header === 'FECHA_NACIMIENTO' && cellValue instanceof Date) {
            const date = moment(cellValue).format('DD-MM-YYYY')
            cellValue = FormatDate(date)
          } else if (typeof cellValue === 'object' && cellValue.text && cellValue.hyperlink) {
            cellValue = cellValue.text
          } else if (typeof cellValue === 'object') {
            cellValue = JSON.stringify(cellValue)
          } else if (typeof cellValue === 'string') {
            cellValue = cellValue.trim()
          }
        } else {
          cellValue = null
        }

        rowData[header] = cellValue
      })
      jsonData.push(rowData)
    })

    const processedData = jsonData.map(row => {
      for (const key in row) {
        if (row[key] && typeof row[key] === 'string') {
          row[key] = row[key].replace(/["']/g, '').trim()
        }
      }
      return row
    })

    setData(processedData)
  } catch (error) {
    console.error('Error al procesar el archivo:', error)
  }
}
