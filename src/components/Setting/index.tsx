import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { motion } from 'framer-motion'
import { Asterisk, Settings } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAtomValue, useSetAtom } from 'jotai'
import { api_key, proxy_url } from '@/store'
import {setAPIKey, setProxyUrl} from '@/utils/settingStorage'
import { Label } from '@/components/ui/label'

const Setting = () => {
    const keyValue = useAtomValue(api_key)
    const urlValue = useAtomValue(proxy_url)
    const setKeyValue = useSetAtom(api_key)
    const setUrlValue = useSetAtom(proxy_url)
    const [apiKeyValue, setApiKeyValue] = useState(keyValue)
    const [proxyUrlValue, setProxyUrlValue] = useState(urlValue)

    function onSetAPIKey(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            handleSetAPIKey()
        }
    }

    function onSetProxyUrl(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            handleSetProxyUrl()
        }
    }

    function handleSetAPIKey() {
        setAPIKey(apiKeyValue)
        setKeyValue(apiKeyValue)
    }

    function handleSetProxyUrl() {
        setProxyUrl(proxyUrlValue)
        setUrlValue(proxyUrlValue)
    }

    function onOpenChange(open: boolean) {
        if (!open) {
            setApiKeyValue(keyValue)
            setProxyUrlValue(urlValue)
        }
    }

    return (
        <Popover onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <motion.div className='fixed right-5 top-5' initial={{ scale: 0.95 }} whileHover={{ scale: 1 }}>
                    <Settings size={24} color='#ffffff' />
                </motion.div>
            </PopoverTrigger>
            <PopoverContent className='w-80'>
                <div className='grid gap-4'>
                    <div className='space-y-2'>
                        <h4 className='font-medium leading-none'>设置</h4>
                    </div>
                    <div className='grid gap-2'>
                        <div className='grid grid-cols-2 items-center gap-3'>
                            <Label htmlFor='API_KEY' className='flex'>
                                <Asterisk size={12} color='red' />
                                API_KEY
                            </Label>
                            <Input
                                id='API_KEY'
                                value={apiKeyValue}
                                className='col-span-2 h-8'
                                onChange={(e) => setApiKeyValue(e.target.value)}
                                onKeyDown={onSetAPIKey}
                            />
                        </div>
                        <div className='grid grid-cols-2 items-center gap-3'>
                            <Label htmlFor='PROXY_URL' className='flex'>
                                <Asterisk size={12} color='red' />
                                PROXY_URL
                            </Label>
                            <Input
                                id='PROXY_URL'
                                value={proxyUrlValue}
                                className='col-span-2 h-8'
                                onChange={(e) => setProxyUrlValue(e.target.value)}
                                onKeyDown={onSetProxyUrl}
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
export default Setting
