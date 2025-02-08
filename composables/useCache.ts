import { useStorage, useNow, type StorageLike } from '@vueuse/core'
import { computed } from 'vue'

interface CacheOptions<T> {
    key: string
    defaultValue: T
    storageType?: 'local' | 'session' | 'memory'
    ttl?: number // Time-to-live in seconds (optional)
    validateFn?: (value: T) => boolean // Custom validation function (optional)
}

// Custom storage adapter for memory-based caching
class MemoryStorage implements StorageLike {
    private store = new Map<string, string>()

    getItem(key: string) {
        return this.store.get(key) || null
    }

    setItem(key: string, value: string) {
        this.store.set(key, value)
    }

    removeItem(key: string) {
        this.store.delete(key)
    }
}

export function useCache<T>({ key, defaultValue, storageType = 'local', ttl, validateFn }: CacheOptions<T>) {
    const storageMap: Record<'local' | 'session' | 'memory', StorageLike> = {
        local: process.client ? localStorage : new MemoryStorage(),
        session: process.client ? sessionStorage : new MemoryStorage(),
        memory: new MemoryStorage(),
    }

    const storage = storageMap[storageType]
    const now = useNow() // Reactive current time

    // Get initial value from storage
    const storedData = useStorage<{ value: T; expiresAt?: number } | null>(key, null, storage)

    const isExpired = computed(() => {
        return ttl && storedData.value?.expiresAt ? now.value.getTime() > storedData.value.expiresAt : false
    })

    // Retrieve data (checking expiration & validation)
    const get = (): T => {
        if (!storedData.value) return defaultValue

        if (isExpired.value || (validateFn && !validateFn(storedData.value.value))) {
            reset()
            return defaultValue
        }

        return storedData.value.value
    }

    // Set data with optional expiration
    const set = (value: T) => {
        storedData.value = {
            value,
            expiresAt: ttl ? now.value.getTime() + ttl * 1000 : undefined,
        }
    }

    // Reset cache entry
    const reset = () => {
        storedData.value = null
    }

    return { get, set, reset, isExpired }
}
