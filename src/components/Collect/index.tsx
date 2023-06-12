import React from 'react'
import {Card, CardContent} from "@/components/ui/card";
import {clsx} from "clsx";
import {Star} from 'lucide-react'
import {ENWord} from "@/types";
import {removeEnWordStore} from "@/utils/enStorage";


type Props = {
    cardList: ENWord[],
    onCancelCollect: (word: string) => void
}

const Collect = async ({cardList, onCancelCollect}: Props) => {


    function sleep() {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 300)
        })
    }

    await sleep()

    return (
        cardList.map(item =>
            <Card key={item.word}
                  className={clsx(['px-2', 'h-10', 'min-w-[100px]', 'items-center', 'flex', 'justify-center', 'bg-second', 'border-0'])}>
                <CardContent className={clsx(['p-0', 'text-second-text'])}>
                    <div className="flex justify-center items-center">
                        <span className="pr-2 font-alimama">{item.word}</span>
                        <Star size={16} fill="yellow" color="yellow" className="cursor-pointer"
                              onClick={() => onCancelCollect(item.word)}></Star>
                    </div>
                </CardContent>
            </Card>
        )
    )
}
export default Collect
