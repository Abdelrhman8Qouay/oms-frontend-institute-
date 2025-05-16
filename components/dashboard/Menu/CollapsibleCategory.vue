<script setup lang="ts">
import type { MenuCategory, MenuItem } from '~/utils/types/menu.type'

const props = defineProps<{
    category: MenuCategory
    defaultOpen?: boolean
}>()

const isOpen = ref(props.defaultOpen || false)
const toggle = () => {
    isOpen.value = !isOpen.value
}
</script>

<template>
    <div class="border border-gray-100 rounded-lg">
        <button @click="toggle"
            class="flex items-center justify-between w-full p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <div class="flex items-center gap-2">
                <Icon name="material-symbols-light:category" class="text-gray-500" />
                <span class="font-medium">{{ category.name }}</span>
                <span class="text-xs text-gray-500 ml-2">({{ category.items?.length || 0 }} items)</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="px-2 py-1 text-xs rounded-full" :class="{
                    'bg-green-100 text-green-800': category.isActive,
                    'bg-gray-100 text-gray-800': !category.isActive
                }">
                    {{ category.isActive ? 'Active' : 'Inactive' }}
                </span>
                <Icon name="mdi-light:chevron-down" class="transition-transform duration-200 text-gray-400"
                    :class="{ 'transform rotate-180': isOpen }" />
            </div>
        </button>

        <div v-show="isOpen" class="pl-8 pr-2 pb-2 space-y-1">
            <template v-if="category.items?.length">
                <DashboardMenuItemCard v-for="item in category.items" :key="item.id" :item="item" class="mt-1" />
            </template>
            <div v-else class="text-sm text-gray-500 italic p-2">
                No items in this category
            </div>

            <!-- <div class="flex justify-end gap-2 pt-2 border-t border-gray-100 mt-1">
                <button class="text-xs text-blue-600 hover:text-blue-800">
                    Add Item
                </button>
                <button class="text-xs text-gray-600 hover:text-gray-800">
                    Edit Category
                </button>
            </div> -->
        </div>
    </div>
</template>