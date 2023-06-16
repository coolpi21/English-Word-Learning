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

/**
 * 判断是否为正确的url地址
 * @param url
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch (e) {
        return false
    }
}

/**
 * 创建英文单词 Prompt
 * @param word
 */
export function generateENWordPrompt(word: string): string {
    return `你是一位优秀的英语老师，每当我输入一个单词，你需要完成以下任务：
    task1: 单词词性、音标、中文释义、英文释义、词根词缀起源故事，一行一个分类
    task2: 用这个单词造三个工作场景英文例句附英文翻译
    task3: 用这个单词的词根词缀，拓展5个相近单词，附带音标、词性和中文释义
    task4: 用 {task3} 拓展出的单词编写一个有趣的A2难度的英文故事，限7行内
    task5: 基于前4个 {task} 生成内容创造3道单选题，选项一行一个
    task6: 基于 {task5} 的3道单选题，在一行中依次给出正确的答案

    将以上任务结果按以下Markdown格式排版输出:
        ### 单词释义
    <task1 result>
    ### 场景例句
    <task2 result>
    ### 相近词
    <task3 result>
    ### 英文故事
    <task4 result>
    ### 小测验
    <task5 result>
    ### 答案
    <task6 result>

    单词是 ${word}`
}
