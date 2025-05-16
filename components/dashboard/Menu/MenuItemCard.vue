<script setup lang="ts">
import type { MenuItem } from '~/utils/types/menu.type'
import { fixedFraction } from '~/utils/functions/format'

const props = defineProps<{
    item: MenuItem
}>()

const isAvailable = ref(props.item.isAvailable)

const toggleAvailability = async () => {
    try {
        // Call API to toggle availability
        isAvailable.value = !isAvailable.value
        // You would typically call the API here:
        // await $api.patch(ENDPOINTS.ADMIN_MENUS.TOGGLE_AVAILABILITY(props.item.id))
    } catch (error) {
        console.error('Failed to toggle availability:', error)
        isAvailable.value = !isAvailable.value // Revert on error
    }
}
</script>

<template>
    <div class="flex items-center justify-between p-2 border border-gray-100 rounded hover:bg-gray-50">
        <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
                <Icon name="material-symbols-light:emoji-food-beverage-outline-rounded" class="text-gray-500" />
                <h4 class="font-medium truncate">{{ item.name }}</h4>
                <span class="text-sm text-gray-500">${{ fixedFraction(2) }}</span>
            </div>
            <p v-if="item.description" class="text-sm text-gray-500 truncate">{{ item.description }}</p>
        </div>
        <div class="flex items-center gap-2 ml-2">
            <button @click.stop="toggleAvailability" class="px-2 py-1 text-xs rounded-full transition-colors" :class="{
                'bg-green-100 text-green-800 hover:bg-green-200': isAvailable,
                'bg-gray-100 text-gray-800 hover:bg-gray-200': !isAvailable
            }">
                {{ isAvailable ? 'Available' : 'Unavailable' }}
            </button>
            <!-- <button class="p-1 text-gray-500 hover:text-gray-700">
                <Icon name="mdi-light:pencil" class="w-4 h-4" />
            </button> -->
        </div>
    </div>
</template>