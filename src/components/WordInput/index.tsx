'use client'
import React from 'react'
import {handleCheckIsEnglishWord} from '@/utils'
import {ClientOnly} from '@/components/ClientOnly'
import {useToast} from "@/components/ui/use-toast";
import {Input} from '@/components/ui/input'
import './index.css'
import chatService from "@/utils/chatService";

type Props = {
    onWordStream: (word: string) => void
}
const WordInput = (props: Props) => {
    const {onWordStream} = props
    const {toast} = useToast()

    chatService.actions = {
        onCompleting: (sug) => {
            // console.log('sug', sug)
            onWordStream(sug)
        },
        onCompleted: () => {
            // setLoading(false);
        },
    };
    const onSubmitWord = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const value = e.currentTarget.value

            if (!handleCheckIsEnglishWord(value)) {
                toast({
                    title: '错误提示',
                    description: '请输入英文单词'
                })
                return
            }

            await requestWordLearning(value)
        }
    }

    async function requestWordLearning(word: string) {
        const prompt = `你是一位优秀的英语老师，每当我输入一个单词，你需要完成以下任务：
            task1: 单词词性、音标、中文释义、英文释义、词根词缀起源故事，一行一个
            task2: 用这个单词造三个工作场景英文例句附英文翻译
            task3: 用这个单词的词根词缀，拓展5个相近单词，附带词性和中文释义
            task4: 用task3拓展出的单词编写一个有趣的A2难度的英文故事，限7行内
            task5: 基于前4个任务生成内容创造3个单选题，选项一行一个，最后一起给出答案
            
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
            
            单词是 ${word}`

        await chatService.getStream({
            prompt
        });


    }

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <ClientOnly>
                <Input placeholder="请输入英文单词"
                       className="Input relative bottom-3 text-[24px]"
                       onKeyDown={(e) => onSubmitWord(e)}></Input>
            </ClientOnly>
        </div>
    )
}
export default WordInput
