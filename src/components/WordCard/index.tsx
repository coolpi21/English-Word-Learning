import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Star, XCircle } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import WorkMarkdown from '@/components/WordMarkdown'

type Props = {
    onCloseWordCard: () => void
    isShowCollect: boolean
    isCollect: boolean
    onCollectWorld: () => void
    wordDefinition: string
}
const WordCard = (props: Props) => {
    const { onCloseWordCard, isShowCollect, isCollect, onCollectWorld, wordDefinition } = props

    const collect_start_variants = {
        show: { opacity: 1 },
        hide: { opacity: 0 },
    }

    return (
        <div className='fixed top-0 left-0 w-screen h-screen backdrop-blur-sm z-[1000]'>
            <motion.div
                initial={{ scale: 0.95 }}
                whileHover={{ scale: 1 }}
                onClick={onCloseWordCard}
                className='absolute right-5 top-5'
            >
                <XCircle size={36} color='#ffffff' />
            </motion.div>
            <AnimatePresence>
                <motion.div animate={{ y: 160 }} initial={{ y: 260 }} exit={{ y: 260 }}>
                    <Card className='absolute left-1/2 -translate-x-1/2 w-[600px] h-[600px] overflow-y-auto no-scrollbar bg-[#151c23]  p-[24px] border-0 z-[1002]'>
                        <CardTitle>
                            <div className='text-white flex justify-end cursor-pointer'>
                                <motion.div variants={collect_start_variants} animate={isShowCollect ? 'show' : 'hide'}>
                                    <Star
                                        size={24}
                                        color={isCollect ? 'yellow' : 'white'}
                                        fill={isCollect ? 'yellow' : 'transparent'}
                                        onClick={onCollectWorld}
                                    />
                                </motion.div>
                            </div>
                        </CardTitle>
                        <CardContent className='word-card__content'>
                            <WorkMarkdown>{wordDefinition}</WorkMarkdown>
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
export default WordCard
