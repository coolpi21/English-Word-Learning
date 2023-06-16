'use client'
import { useState } from 'react'

const crypto: Crypto = window.crypto

async function generateKey() {
    return await crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    )
}

async function encrypt(plainText: string, key: CryptoKey) {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encoder = new TextEncoder()
    const encodedPlainText = encoder.encode(plainText)

    const encrypted = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        encodedPlainText
    )

    return {
        iv: iv,
        encryptedData: new Uint8Array(encrypted),
    }
}

async function decrypt(encryptedData: Uint8Array, key: CryptoKey, iv: Uint8Array) {
    const decrypted = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        encryptedData
    )

    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
}

export function useEncryption() {
    const [key, setKey] = useState<CryptoKey | null>(null)

    const initializeKey = async () => {
        const newKey = await generateKey()
        setKey(newKey)
    }

    return {
        key,
        initializeKey,
        encrypt,
        decrypt,
    }
}
