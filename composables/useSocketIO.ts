import { ref, onUnmounted } from 'vue'
import { UserRole } from '~/utils/types/user.type'

export const useSocketIo = () => {
    const { $socket } = useNuxtApp()

    // State
    const isConnected = ref(false)

    // ===================================== Socket Connection
    const connectSocket = () => {
        if (!$socket.connected) {
            $socket.connect() // Ensure connection before emitting
            isConnected.value = true
            console.log('✅ Socket Connected:', $socket.id)
        }
    }

    const disconnectSocket = () => {
        if ($socket.connected) {
            $socket.disconnect() // Ensure connection before emitting
            isConnected.value = false
            console.log('❌ Socket Disconnected')
        }
    }

    // ===================================== Room Management
    const joinRoom = (userRoles: UserRole[], emitEvent: string = 'joinRoom') => {
        $socket.emit(emitEvent, { roles: [...userRoles] }, (res: any) => {
            console.log('JoinRoom Response:', res)
        })
    }
    const joinOrderRoom = (orderId: string, emitEvent: string = 'joinOrderRoom') => {
        let roomName = ''
        $socket.emit(emitEvent, orderId, (res: any) => {
            console.log(emitEvent + ' Response: ', res)
            roomName = res
        })
        return roomName
    }

    const leaveRoom = (room: string, emitEvent: string = 'leaveRoom') => {
        $socket.emit(emitEvent, room, (res: any) => {
            console.log('LeaveRoom Response:', res)
        })
    }

    // ===================================== Event Listeners
    const listenToEvent = (eventName: string, callback: (data: any) => void) => {
        $socket.on(eventName, callback)
    }

    const removeEventListener = (eventName: string) => {
        $socket.off(eventName)
    }

    // ===================================== Cleanup
    const cleanupSocket = () => {
        if ($socket) {
            $socket.off('connect')
            $socket.off('disconnect')
            disconnectSocket()
        }
    }

    // Automatically clean up on unmount
    onUnmounted(() => {
        cleanupSocket()
    })

    return {
        isConnected,
        connectSocket,
        disconnectSocket,
        joinRoom,
        joinOrderRoom,
        leaveRoom,
        listenToEvent,
        removeEventListener,
    }
}
