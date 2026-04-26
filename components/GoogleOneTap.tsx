'use client'

import Script from 'next/script'
import { createClient } from '@/utils/supbase/client'
import { useRouter } from 'next/navigation'

const generateNonce = async (): Promise<[string, string]> => {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    const encoder = new TextEncoder()
    const encodedNonce = encoder.encode(nonce)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return [nonce, hashedNonce]
}

export default function GoogleOneTap() {
    const supabase = createClient()
    const router = useRouter()

    const initializeOneTap = async () => {
        const [nonce, hashedNonce] = await generateNonce()

        const { data } = await supabase.auth.getSession()
        if (data.session) {
            router.push('/')
            return
        }

        // @ts-ignore
        google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            nonce: hashedNonce,
            use_fedcm_for_prompt: true, // Required for Chrome's third-party cookie phase-out
            callback: async ({ credential }: { credential: string }) => {
                const { error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: credential,
                    nonce,
                })
                if (!error) router.push('/')
            },
        })

        // @ts-ignore
        google.accounts.id.prompt()
    }

    return (s
        <Script
            src="https://accounts.google.com/gsi/client"
            onReady={initializeOneTap}
        />
    )
}