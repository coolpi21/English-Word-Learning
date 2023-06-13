'use client'
import React, { useState } from 'react'
import WordInput from '@/components/WordInput'
import { Toaster } from '@/components/ui/toaster'
import './page.css'
import Sidebar from '@/components/Sidebar'
import { addEnWordStore, getEnWordStore, removeEnWordStore } from '@/utils/enStorage'
import { useSetAtom } from 'jotai'
import { collectWordCardList } from '@/store'
import chatService from '@/utils/chatService'
import WordCard from '@/components/WordCard'
import Setting from '@/components/Setting'

const Home = () => {
    const [searchWord, setSearchWord] = useState('')
    const [wordDefinition, setWordDefinition] = useState('')
    const [isShowCard, setIsShowCard] = useState(false)
    const [isCollect, setIsCollect] = useState(false)
    const [isShowCollect, setIsShowCollect] = useState(false)
    const setCollectList = useSetAtom(collectWordCardList)
    const [isLoading, setIsLoading] = useState(false)

    function onWordStream(word: string) {
        setIsLoading(true)
        setIsShowCard(true)
        setWordDefinition(word)
    }

    function onWordCompleted() {
        setIsShowCollect(true)
        setIsLoading(false)
    }

    function onGetWord(word: string) {
        setSearchWord(word)
    }

    function handleCollectWord() {
        if (!isShowCollect) return
        setIsCollect(!isCollect)

        if (!isCollect) {
            addEnWordStore({
                word: searchWord,
                content: wordDefinition,
            })
        } else {
            removeEnWordStore(searchWord)
        }

        setCollectList(getEnWordStore())
    }

    function handleCloseWordCard() {
        if (isLoading) {
            chatService.cancel()
        }
        setIsShowCard(false)
        setIsCollect(false)
        setIsShowCollect(false)
    }

    return (
        <div className='container h-screen w-screen flex flex-col items-center justify-center'>
            <Sidebar />
            <WordInput onWordStream={onWordStream} onWordCompleted={onWordCompleted} onGetWord={onGetWord} />
            {isShowCard && (
                <WordCard
                    isCollect={isCollect}
                    isShowCollect={isShowCollect}
                    wordDefinition={wordDefinition}
                    onCloseWordCard={handleCloseWordCard}
                    onCollectWorld={handleCollectWord}
                ></WordCard>
            )}

            <Setting />

            <Toaster></Toaster>
        </div>
    )
}
export default Home
