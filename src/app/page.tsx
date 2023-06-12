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
import {AnimatePresence, motion} from 'framer-motion'
import Sidebar from "@/components/Sidebar";
import {Star} from "lucide-react";
import {addEnWordStore, removeEnWordStore} from "@/utils/enStorage";

const Home = () => {
    const [searchWord, setSearchWord] = useState('')
    const [wordDefinition, setWordDefinition] = useState('')
    const [isShowCard, setIsShowCard] = useState(false)
    const [isCollect, setIsCollect] = useState(false)
    const [isShowCollect, setIsShowCollect] = useState(false)

    const collect_start_variants = {
        show: {opacity: 1},
        hide: {opacity: 0}
    }

    function onWordStream(word: string) {
        setIsShowCard(true)
        setWordDefinition(word)
    }

    function onWordCompleted() {
        setIsShowCollect(true)

    }

    function onGetWord(word: string) {
        setSearchWord(word)
    }

    function handleCollectWord() {
        setIsCollect(!isCollect)

        if (!isCollect) {
            addEnWordStore({
                word: searchWord,
                content: wordDefinition
            })
        } else {
            removeEnWordStore(searchWord)
        }
    }


    return (
        <div className="container h-screen w-screen flex flex-col items-center justify-center">
            <Sidebar/>
            <WordInput onWordStream={onWordStream} onWordCompleted={onWordCompleted} onGetWord={onGetWord}/>
            {isShowCard && (
                <motion.div animate={{y: -60}} className="fixed left-1/2">
                    <Card
                        className="w-[600px] max-h-[600px] overflow-y-auto no-scrollbar bg-[#151c23]  p-[24px] border-0">
                        <CardTitle>
                            <div className="text-white flex justify-between">
                                <span>卡片</span>
                                <motion.div variants={collect_start_variants} animate={isShowCollect ? 'show' : 'hide'}
                                            initial={false}>
                                    <Star size={24} color={isCollect ? 'yellow' : 'white'}
                                          fill={isCollect ? 'yellow' : 'transparent'}
                                          onClick={handleCollectWord}/>
                                </motion.div>

                            </div>
                        </CardTitle>
                        <CardContent className="word-card__content">
                            <WorkMarkdown>{wordDefinition}</WorkMarkdown>
                        </CardContent>
                    </Card>
                </motion.div>
            )}


            <Toaster></Toaster>
        </div>
    )
}
export default Home
