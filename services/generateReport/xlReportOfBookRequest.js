const xlsx = require('xlsx')
const path = require('path')

const exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => { 
        try {
            const workBook = xlsx.utils.book_new()
            const workSheetData = [
                workSheetColumnNames,
                ... data
            ]
            const workSheet = xlsx.utils.aoa_to_sheet(workSheetData)
            xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName)
            xlsx.writeFile(workBook, path.resolve(filePath))
        } catch (err) {
            console.error(err.message)
        }
}

module.exports = {exportExcel}