import { atom } from 'jotai'
import { getEnWordStore } from '@/utils/enStorage'
import { getAPIKey, getProxyUrl } from '@/utils/settingStorage'

export const collectWordCardList = atom(getEnWordStore())

export const dynamicCollectWordCardList = atom((get) => get(collectWordCardList))

export const api_key = atom(getAPIKey())

export const proxy_url = atom(getProxyUrl())
