<script setup lang="ts">
import { ref } from 'vue'
import { useAxios } from '@vueuse/integrations/useAxios'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'
import type { MenuItem } from '~/utils/types/menu.type'

const { $api } = useNuxtApp()
// State for menu items
const menuItems = ref<MenuItem[]>([])
const isEditing = ref(false)
const editedItem = ref<MenuItem | null>(null)

// Fetch menu items
const { isLoading: loading, execute: fetchMenuItems } = useAxios(
    ENDPOINTS.ADMIN_MENUS.GET_MENUS,
    { method: 'GET' },
    $api,
    {
        initialData: [],
        immediate: false,
        onSuccess(data) {
            menuItems.value = data
        },
        onError(err) {
            console.error('Failed to fetch menu items:', err)
        },
    }
)

// Edit menu item
const editItem = (item: MenuItem) => {
    isEditing.value = true
    editedItem.value = { ...item }
}

// Save edited item
const saveItem = async () => {
    if (!editedItem.value) return

    try {
        await $api.put(ENDPOINTS.ADMIN_MENUS.UPDATE_MENU(editedItem.value.id), editedItem.value)
        fetchMenuItems() // Refresh menu items
        isEditing.value = false
        editedItem.value = null
    } catch (err) {
        console.error('Failed to update menu item:', err)
    }
}

// Delete menu item
const deleteItem = async (id: string) => {
    try {
        await $api.delete(ENDPOINTS.ADMIN_MENUS.DELETE_MENU(id))
        fetchMenuItems() // Refresh menu items
    } catch (err) {
        console.error('Failed to delete menu item:', err)
    }
}

// Fetch menu items on mount
onMounted(() => {
    fetchMenuItems()
})
</script>

<template>
    <div class="bg-white p-4 rounded shadow mb-6">
        <h2 class="text-xl font-semibold mb-4">🔹 Menu Management</h2>
        <CommonLoader v-if="loading" />
        <div v-else>
            <!-- Edit Form (Conditional) -->
            <div v-if="isEditing" class="mb-4">
                <h3 class="text-lg font-medium mb-2">✏ Edit Item</h3>
                <input v-model="editedItem!.name" class="p-2 border rounded mb-2" placeholder="Item Name" />
                <input v-model="editedItem!.price" type="number" class="p-2 border rounded mb-2" placeholder="Price" />
                <button @click="saveItem" class="p-2 bg-green-500 text-white rounded">Save</button>
                <button @click="isEditing = false" class="p-2 bg-gray-500 text-white rounded ml-2">Cancel</button>
            </div>

            <!-- Menu Items List -->
            <ul class="space-y-2">
                <li v-for="item in menuItems" :key="item.id"
                    class="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                        <p class="font-medium">{{ item.name }}</p>
                        <p class="text-gray-600">${{ item.price }}</p>
                    </div>
                    <div class="flex gap-2">
                        <button @click="editItem(item)" class="p-1 bg-blue-500 text-white rounded">✏ Edit</button>
                        <button @click="deleteItem(item.id)" class="p-1 bg-red-500 text-white rounded">🗑
                            Delete</button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>