<template>
    <div class="admin-menu-edit">
        <!-- Page Header -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">
                {{ menuData?.id ? `Edit ${menuData.name}` : 'Edit <empty name>' }}
            </h1>
            <NuxtLink to="/dashboard/menus" class="text-blue-600 hover:text-blue-800">
                ← Back to Menus
            </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="fetchError" class="p-4 bg-red-100 text-red-800 rounded-lg mb-6">
            Failed to load menu: {{ fetchError.message || 'Unknown error' }}
            <button @click="fetchMenu" class="ml-2 text-blue-600 hover:text-blue-800">
                Retry
            </button>
        </div>

        <!-- Edit Form -->
        <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow overflow-hidden">
            <!-- Menu Details -->
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-lg font-medium mb-4">Menu Details</h2>

                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Menu Name</label>
                        <input v-model="menuForm.name" type="text" id="name" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                    </div>

                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                        <textarea v-model="menuForm.description" id="description" rows="3"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>
                    </div>

                    <div>
                        <label class="inline-flex items-center">
                            <input v-model="menuForm.isActive" type="checkbox"
                                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            <span class="ml-2 text-sm text-gray-700">Active Menu</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Categories Section -->
            <div class="p-6 border-b border-gray-300">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-medium">Categories</h2>
                    <button type="button" @click="addNewCategory"
                        class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Add Category
                    </button>
                </div>

                <div v-if="!menuForm.categories.length" class="text-center py-4 text-gray-500">
                    No categories added yet
                </div>

                <div v-else class="space-y-4">
                    <div v-for="(category, catIndex) in menuForm.categories" :key="catIndex"
                        class="border border-gray-300 rounded-lg p-4">
                        <div class="flex justify-between items-start mb-3">
                            <div class="flex items-center w-full">
                                <div class="flex-1">
                                    <label :for="`category-name-${catIndex}`"
                                        class="block text-sm font-medium text-gray-700">Category Name</label>
                                    <input v-model="category.name" :id="`category-name-${catIndex}`" type="text"
                                        required
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                </div>
                                <!-- Display Order -->
                                <div class="flex-1">
                                    <label :for="`category-order-${catIndex}`"
                                        class="block text-sm font-medium text-gray-700">Display Order <span
                                            title="Sort this category in the menu">?</span></label>
                                    <input v-model.number="category.displayOrder" :id="`category-order-${catIndex}`"
                                        type="number" min="1"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                </div>
                            </div>
                            <div class="ml-4 flex items-start">
                                <label class="inline-flex items-center">
                                    <input v-model="category.isActive" type="checkbox"
                                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <span class="ml-2 text-sm text-gray-700">Active</span>
                                </label>
                                <button type="button" @click="removeCategory(catIndex)"
                                    class="ml-4 p-1 text-red-600 hover:text-red-800">
                                    <Icon name="trash" class="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <!-- Items Section -->
                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="text-sm font-medium text-gray-700">Items</h3>
                                <button type="button" @click="addNewItem(catIndex)"
                                    class="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Add Item
                                </button>
                            </div>

                            <div v-if="!category.items.length" class="text-center py-2 text-sm text-gray-500">
                                No items in this category
                            </div>

                            <div v-else class="space-y-3">
                                <div v-for="(item, itemIndex) in category.items" :key="itemIndex"
                                    class="border border-gray-300 rounded-lg p-3">
                                    <div class="flex justify-between items-start">
                                        <div class="flex-1 flex flex-wrap items-center gap-2">
                                            <div class="flex-1">
                                                <label :for="`item-name-${catIndex}-${itemIndex}`"
                                                    class="block text-xs font-medium text-gray-700">Name</label>
                                                <input v-model="item.name" :id="`item-name-${catIndex}-${itemIndex}`"
                                                    type="text" required
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            </div>
                                            <div class="flex-1">
                                                <label :for="`item-price-${catIndex}-${itemIndex}`"
                                                    class="block text-xs font-medium text-gray-700">Price</label>
                                                <input v-model.number="item.price"
                                                    :id="`item-price-${catIndex}-${itemIndex}`" type="number" min="0.01"
                                                    step="0.01" required
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            </div>
                                            <div class="flex-1">
                                                <label :for="`item-preparation-${catIndex}-${itemIndex}`"
                                                    class="block text-xs font-medium text-gray-700">Preparation
                                                    Time</label>
                                                <input v-model.number="item.preparationTime"
                                                    :id="`item-preparation-${catIndex}-${itemIndex}`" type="number"
                                                    min="0" step="1" required
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            </div>
                                            <div class="[flex:1_0_100%]">
                                                <label :for="`item-desc-${catIndex}-${itemIndex}`"
                                                    class="block text-xs font-medium text-gray-700">Description</label>
                                                <textarea v-model="item.description"
                                                    :id="`item-desc-${catIndex}-${itemIndex}`" rows="2"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>
                                            </div>
                                        </div>
                                        <div class="ml-4 flex flex-col items-center">
                                            <label class="inline-flex items-center mb-2">
                                                <input v-model="item.isAvailable" type="checkbox"
                                                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                                <span class="ml-2 text-xs text-gray-700">Available</span>
                                            </label>
                                            <button type="button" @click="removeItem(catIndex, itemIndex)"
                                                class="p-1 text-red-600 hover:text-red-800">
                                                <Icon name="trash" class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Form Actions -->
            <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <NuxtLink to="/dashboard/menus"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Cancel
                </NuxtLink>
                <button type="submit" :disabled="isSubmitting"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span v-if="isSubmitting" class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        Saving...
                    </span>
                    <span v-else>Save Changes</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import type { MenuObject, MenuCategory, MenuItem } from '~/utils/types/menu.type'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'
import { fixedFraction } from '~/utils/functions/format'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

definePageMeta({
    layout: 'admin',
})

const menuId = computed(() => route.params.menuId as string)

// Form state
const menuData = ref<MenuObject | null>(null)
const menuForm = reactive({
    name: '',
    description: '',
    isActive: true,
    categories: [] as Array<{
        id?: string
        name: string
        displayOrder: number
        isActive: boolean
        items: Array<{
            id?: string
            name: string
            price: number
            preparationTime: number
            description: string
            isAvailable: boolean
        }>
    }>
})

// UI state
const isLoading = ref(false)
const fetchError = ref<any>(null)
const isSubmitting = ref(false)

// Fetch menu data
const fetchMenu = async () => {
    try {
        isLoading.value = true
        fetchError.value = null

        const response = await $api.get(ENDPOINTS.ADMIN_MENUS.GET_MENU_BY_ID(menuId.value))

        menuData.value = response.data
        Object.assign(menuForm, {
            name: response.data.name || '',
            description: response.data.description || '',
            isActive: response.data.isActive !== false,
            categories: (response.data.categories as MenuCategory[])?.map((cat: MenuCategory) => ({
                id: cat.id,
                name: cat.name || '',
                displayOrder: cat.displayOrder || 1,
                isActive: cat.isActive !== false,
                items: (cat.items as MenuItem[])?.map((item: MenuItem) => ({
                    id: item.id,
                    name: item.name || '',
                    price: fixedFraction(item.price || 0),
                    preparationTime: item.preparationTime || 0,
                    description: item.description || '',
                    isAvailable: item.isAvailable !== false
                })) || []
            })) || []

        })
    } catch (err) {
        fetchError.value = err
        console.error('Failed to fetch menu:', err)
    } finally {
        isLoading.value = false
    }
}

// Initialize form for new menu
const initNewMenu = () => {
    menuData.value = null
    Object.assign(menuForm, {
        name: '',
        description: '',
        isActive: true,
        categories: []
    })
}

// Add new category
const addNewCategory = () => {
    menuForm.categories.push({
        name: '',
        displayOrder: menuForm.categories.length + 1,
        isActive: true,
        items: []
    })
}

// Remove category
const removeCategory = (index: number) => {
    menuForm.categories.splice(index, 1)
    // Update display orders
    menuForm.categories.forEach((cat, i) => {
        cat.displayOrder = i + 1
    })
}

// Add new item to category
const addNewItem = (categoryIndex: number) => {
    menuForm.categories[categoryIndex].items.push({
        name: '',
        price: 0,
        preparationTime: 0,
        description: '',
        isAvailable: true
    })
}

// Remove item from category
const removeItem = (categoryIndex: number, itemIndex: number) => {
    menuForm.categories[categoryIndex].items.splice(itemIndex, 1)
}

// Handle form submission
const handleSubmit = async () => {
    try {
        isSubmitting.value = true

        const payload = {
            name: menuForm.name,
            description: menuForm.description,
            isActive: menuForm.isActive,
            categories: menuForm.categories.map(cat => ({
                name: cat.name,
                displayOrder: cat.displayOrder,
                isActive: cat.isActive,
                items: cat.items.map(item => ({
                    name: item.name,
                    price: fixedFraction(item.price || 0, 2),
                    preparationTime: item.preparationTime || 0,
                    description: item.description,
                    isAvailable: item.isAvailable
                }))
            }))
        }

        if (menuId.value === 'create') {
            // Create new menu
            await $api.post(ENDPOINTS.ADMIN_MENUS.CREATE_MENU, payload)
        } else {
            // Update existing menu
            await $api.put(ENDPOINTS.ADMIN_MENUS.UPDATE_MENU(menuId.value), payload)
        }

        router.push('/dashboard/menus')
    } catch (err) {
        console.error('Failed to save menu:', err)
        // Show error to user
    } finally {
        isSubmitting.value = false
    }
}

// Initialize
if (menuId.value === 'create') {
    initNewMenu()
} else {
    fetchMenu()
}
</script>

<style scoped>
.admin-menu-edit {
    @apply max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6;
}
</style>