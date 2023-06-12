'use client'
import React, {useState} from 'react'
import WordInput from '@/components/WordInput'
import {Toaster} from "@/components/ui/toaster"
import './page.css'
import {
    Card,
    CardContent,
    CardTitle
} from "@/components/ui/card"
import {clsx} from "clsx";
import WorkMarkdown from "@/components/WordMarkdown";

const Home = () => {
    const [wordDefinition, setWordDefinition] = useState('')
    const [isShowCard, setIsShowCard] = useState(false)

    function onWordStream(word: string) {
        setIsShowCard(true)
        setWordDefinition(word)
    }

    return (
        <div className="container h-screen w-screen flex flex-col items-center justify-center">

            <WordInput onWordStream={onWordStream}/>

            <div
                className={clsx([
                    'card-wrapper', 'fixed', 'w-screen', 'h-screen', 'left-0', 'top-0', 'bg-blend-overlay', 'flex', 'items-center', 'justify-center',
                    isShowCard ? 'block' : 'hidden',
                ])}>
                <Card className="w-[600px] h-[600px] overflow-y-auto no-scrollbar bg-[#151c23]  p-[24px]">
                    <CardContent className="word-card__content">
                        <WorkMarkdown>{wordDefinition}</WorkMarkdown>
                    </CardContent>
                </Card>
            </div>
            <Toaster></Toaster>
        </div>
    )
}
export default Home
