<script setup lang="ts">
import type { MenuObject, MenuCategory, MenuItem } from '~/utils/types/menu.type'

const props = defineProps<{
    menu: MenuObject
    defaultOpen?: boolean
}>()

const isOpen = ref(props.defaultOpen || false)
const toggle = () => {
    isOpen.value = !isOpen.value
}

defineEmits(['toggle-activation', 'delete-menu'])
</script>

<template>
    <li class="border-b border-gray-200 last:border-b-0">
        <button @click="toggle"
            class="flex items-center justify-between w-full p-4 text-gray-800 hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3">
                <Icon name="ic:twotone-view-list" class="text-gray-500" />
                <span class="font-medium">{{ menu.name }}</span>
                <span v-if="menu.description" class="text-sm text-gray-500 ml-2">{{ menu.description }}</span>
            </div>
            <div class="flex items-center gap-2">
                <button type='button' :disabled="menu.isActive" @click.prevent="$emit('toggle-activation', menu.id)"
                    class="px-2 py-1 text-xs rounded-full cursor-pointer opacity-60 hover:opacity-100" :class="{
                        'bg-green-100 text-green-800': menu.isActive,
                        'bg-gray-100 text-gray-800': !menu.isActive
                    }">
                    {{ menu.isActive ? 'Active' : 'Inactive' }}
                </button>
                <button type='button' @click.prevent="$emit('delete-menu', menu.id)"
                    class="px-2 py-1 text-xs rounded-md cursor-pointer border border-red-500 hover:bg-red-500 hover:text-white transition-all">
                    Delete
                </button>
                <Icon name="mdi-light:chevron-down" class="transition-transform duration-200 text-gray-400"
                    :class="{ 'transform rotate-180': isOpen }" />
            </div>
        </button>

        <div v-show="isOpen" class="pl-8 pr-4 pb-2 space-y-2">
            <template v-if="menu.categories?.length">
                <DashboardMenuCollapsibleCategory v-for="category in menu.categories" :key="category.id"
                    :category="category" class="mt-2" />
            </template>
            <div v-else class="text-sm text-gray-500 italic p-2">
                No categories in this menu
            </div>

            <div class="flex justify-end gap-2 pt-2 border-t border-gray-100 mt-2">
                <!-- <button class="text-xs text-blue-600 hover:text-blue-800">
                    Add Category
                </button> -->
                <NuxtLink :to="'/dashboard/menus/' + menu.id" class="text-xs text-gray-600 hover:text-gray-800">
                    Edit Menu
                </NuxtLink>
            </div>
        </div>
    </li>
</template>