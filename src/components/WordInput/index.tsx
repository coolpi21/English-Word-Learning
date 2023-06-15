'use client'
import React, { useEffect, useRef, useState } from 'react'
import { handleCheckIsEnglishWord } from '@/utils'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import './index.css'
import chatService from '@/utils/chatService'
import { ALL_SETTINGS_EMPTY_ERROR, API_KEY_EMPTY_ERROR, PROXY_URL_EMPTY_ERROR } from '@/constant'
import { getEnWordStore } from '@/utils/enStorage'

type Props = {
    onShowWordCard: () => void
    onWordStream: (word: string) => void
    onWordCompleted: (word: string) => void
    onGetWord: (word: string) => void
    onWordIsInLocalCompleted: (word: string) => void
}

const WordInput = (props: Props) => {
    const { onWordStream, onWordCompleted, onGetWord, onWordIsInLocalCompleted, onShowWordCard } = props
    const { toast } = useToast()
    const [searchWord, setSearchWord] = useState('')
    const [loading, setLoading] = useState(false)
    const wordInput = useRef<HTMLInputElement>(null)

    chatService.actions = {
        onCompleting: (sug) => {
            onWordStream(sug)
        },
        onCompleted: (sug: string) => {
            onWordCompleted(sug)
            setLoading(false)
        },
    }

    useEffect(() => {
        if (!wordInput.current) return
        wordInput.current.focus()
    }, [])

    const onSubmitWord = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (!checkIsEmptyInput()) return
            if (!handleCheckIsEnglishWord(searchWord)) {
                toast({
                    description: '请输入英文单词',
                    className: 'bg-[#ff4d4f] border-0 text-white',
                })
                return
            }
            if (checkIsExistInLocal(searchWord)) return
            onGetWord(searchWord)
            onShowWordCard()
            await requestWordLearning()
        }
    }

    async function requestWordLearning() {
        if (loading) return
        const prompt = `你是一位优秀的英语老师，每当我输入一个单词，你需要完成以下任务：
            task1: 单词词性、音标、中文释义、英文释义、词根词缀起源故事，一行一个
            task2: 用这个单词造三个工作场景英文例句附英文翻译
            task3: 用这个单词的词根词缀，拓展5个相近单词，附带音标、词性和中文释义
            task4: 用task3拓展出的单词编写一个有趣的A2难度的英文故事，限7行内
            task5: 基于前4个任务生成内容创造3个单选题，选项一行一个，最后一行一起给出每题的答案
            
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
            
            单词是 ${searchWord}`
        setLoading(true)
        try {
            await chatService.getStream({
                prompt,
            })
        } catch (e) {
            const error = e as Error

            if (error.message === API_KEY_EMPTY_ERROR) {
                toast({
                    description: '请去填写API KEY',
                    className: 'bg-[#ff4d4f] border-0 text-white',
                })
            }

            if (error.message === PROXY_URL_EMPTY_ERROR) {
                toast({
                    description: '请去填写PROXY URL',
                    className: 'bg-[#ff4d4f] border-0 text-white',
                })
            }

            if (error.message === ALL_SETTINGS_EMPTY_ERROR) {
                toast({
                    description: '您的配制项为空，请去填写',
                    className: 'bg-[#ff4d4f] border-0 text-white',
                })
            }
        } finally {
            setLoading(false)
            setSearchWord('')
        }
    }

    function checkIsEmptyInput() {
        if (searchWord === '') {
            toast({
                description: '请输入英文单词',
                className: 'bg-[#ff4d4f] border-0 text-white',
            })
            return false
        }
        return true
    }

    function checkIsExistInLocal(word: string) {
        const wordList = getEnWordStore()
        const existWord = wordList.find((v) => v.word === word)

        if (existWord) {
            onWordIsInLocalCompleted(existWord.content)
            return true
        }
        return false
    }

    return (
        <div className='h-screen w-screen flex items-center justify-center '>
            <div className='input-wrapper relative flex justify-center items-center'>
                <Input
                    placeholder='请输入英文单词'
                    value={searchWord}
                    ref={wordInput}
                    className='Input text-md'
                    onChange={(e) => setSearchWord(e.target.value)}
                    onKeyDown={(e) => onSubmitWord(e)}
                />
            </div>
        </div>
    )
}
export default WordInput
