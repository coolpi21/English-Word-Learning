import { getLocal, setLocal } from '@/utils/storage'
import { API_KEY, PROXY_URL } from '@/constant'

export function getAPIKey() {
    return getLocal(API_KEY) || ''
}

export function setAPIKey(key: string) {
    setLocal(API_KEY, key)
}

export function getProxyUrl() {
    return getLocal(PROXY_URL) || ''
}

export function setProxyUrl(url: string) {
    setLocal(PROXY_URL, url)
}
