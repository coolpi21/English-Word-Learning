import { ENWord } from '@/types'

export function handleCheckIsEnglishWord(word: string) {
    const reg = /^[a-zA-Z]+$/
    return reg.test(word)
}

function convertToCSV(data: ENWord[]) {
    const headers = Object.keys(data[0]).join(',')
    const rows = data
        .map((row) => {
            return Object.values(row)
                .map((value) => `"${value}"`)
                .join(',')
        })
        .join('\n')

    return `${headers}\n${rows}`
}

export function downloadCSV(data: ENWord[], fileName = 'data.csv') {
    const csvData = convertToCSV(data)
    const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8' })

    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(csvBlob)
    downloadLink.download = fileName

    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
}
