import React, { Suspense, useEffect, useState } from 'react'
import './index.css'
import { motion } from 'framer-motion'
import Collect from '@/components/Collect'
import { downloadCSV } from '@/utils'
import { Button } from '@/components/ui/button'
import { ArrowRight, X } from 'lucide-react'
import { clsx } from 'clsx'
import { getEnWordStore, removeEnWordStore } from '@/utils/enStorage'
import { useAtomValue, useSetAtom } from 'jotai'
import { collectWordCardList } from '@/store'
import WordCard from '@/components/WordCard'

const Sidebar = () => {
    const [isWider, setIsWider] = useState(false)
    const collectList = useAtomValue(collectWordCardList)
    const setCollectList = useSetAtom(collectWordCardList)
    const [isShowWordCard, setIsShowWordCard] = useState(false)
    const [collectWord, setCollectWord] = useState('')

    const open_btn_variants = {
        open: { left: 'calc(100vw - 110px)' },
        close: { left: '90px' },
    }

    const download_btn_variants = {
        open: { opacity: 1 },
        close: { opacity: 0 },
    }

    function onCancelCollect(word: string) {
        removeEnWordStore(word)
        setCollectList(getEnWordStore())
    }

    function changeSidebarWidth() {
        setIsWider(!isWider)
    }

    function handleDownloadCSV() {
        const data = getEnWordStore()

        downloadCSV(data)
    }

    function getCurrentWordContent(): string {
        const word = collectList.find((item) => item.word === collectWord)
        if (!word) return '暂未找到该单词'

        return word.content
    }

    function onCollectWord() {
        onCancelCollect(collectWord)
        setIsShowWordCard(false)
    }

    return (
        <motion.div
            initial={{ width: '120px', position: 'fixed', left: 0, top: 0 }}
            animate={{ width: isWider ? 'calc(100vw - 80px)' : '120px' }}
            style={{ zIndex: isWider ? 100 : 10 }}
            className='backdrop-blur-sm'
        >
            <div className='side-bar h-screen text-white relative'>
                <div className='flex flex-col absolute left-[60px] top-5 -translate-x-1/2 justify-center items-center'>
                    <svg
                        height='64'
                        aria-hidden='true'
                        viewBox='0 0 16 16'
                        version='1.1'
                        width='64'
                        data-view-component='true'
                        className='octicon octicon-mark-github'
                    >
                        <path d='M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z'></path>
                    </svg>
                    <motion.div variants={download_btn_variants} animate={isWider ? 'open' : 'close'} initial={false}>
                        <Button onClick={handleDownloadCSV} className='w-[100px] download--btn mt-6'>
                            下载CSV
                        </Button>
                    </motion.div>
                </div>

                <motion.div
                    variants={open_btn_variants}
                    style={{ position: 'absolute', top: '50%', translateY: '-50%', zIndex: 100 }}
                    animate={isWider ? 'open' : 'close'}
                    initial={false}
                >
                    <motion.div
                        onClick={changeSidebarWidth}
                        className={clsx([
                            'w-[60px]',
                            'h-[60px]',
                            'rounded-full',
                            'bg-second',
                            'flex',
                            'justify-center',
                            'items-center',
                            'cursor-pointer',
                        ])}
                        initial={{ scale: 0.95 }}
                        whileHover={{ scale: 1.2 }}
                    >
                        {isWider ? <X size={24} color='#ffffff' /> : <ArrowRight size={24} color='#ffffff' />}
                    </motion.div>
                </motion.div>

                <Suspense fallback={<div className='absolute left-[120px] top-5 font-alimama'>Loading...</div>}>
                    {isWider && (
                        <div className='collect-container absolute top-0 right-0 w-[calc(100%-80px)] h-full flex flex-wrap gap-4 p-10 content-start'>
                            <Collect
                                cardList={collectList}
                                onCancelCollect={onCancelCollect}
                                onSelectCollectWord={(word) => {
                                    setIsShowWordCard(true)
                                    setCollectWord(word)
                                }}
                            ></Collect>
                        </div>
                    )}
                </Suspense>

                {isShowWordCard && (
                    <WordCard
                        onCloseWordCard={() => {
                            setIsShowWordCard(false)
                        }}
                        isShowCollect={true}
                        isCollect={true}
                        onCollectWorld={onCollectWord}
                        wordDefinition={getCurrentWordContent()}
                    />
                )}
            </div>
        </motion.div>
    )
}
export default Sidebar
