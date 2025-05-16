<template>
    <div class="relative inline-block text-left z-[10000]">
        <button @click="isOpen = !isOpen"
            class="flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
            {{ title }}
            <Icon v-if="props.icon" :name="props.icon" class="-mr-1 ml-2 h-4 w-4" />
        </button>

        <div v-show="isOpen" @click.away="isOpen = false"
            class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div class="py-1">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: ''
    },
    defaultOpen: {
        type: Boolean,
        default: false
    }
})

const isOpen = ref(props.defaultOpen || false)
</script>