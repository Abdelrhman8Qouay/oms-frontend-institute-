// plugins/socket.client.js
import { io, Socket } from 'socket.io-client'

declare module '#app' {
    interface NuxtApp {
        $socket: Socket
    }
}

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const socket = io(config.public.socketUrl, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    })

    nuxtApp.provide('socket', socket as Socket)
})
