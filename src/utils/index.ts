export function handleCheckIsEnglishWord(word: string) {
    const reg = /^[a-zA-Z]+$/
    return reg.test(word)
}
