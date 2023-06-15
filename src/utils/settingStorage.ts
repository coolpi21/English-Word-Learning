import { getLocal, setLocal } from '@/utils/storage'
import { API_KEY, DEFAULT_MODEL, PROXY_URL } from '@/constant'
import { ModelType } from '@/types'

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

export function setModel(model: ModelType) {
    setLocal(DEFAULT_MODEL, model)
}

export function getModel() {
    return getLocal(DEFAULT_MODEL) || ''
}
