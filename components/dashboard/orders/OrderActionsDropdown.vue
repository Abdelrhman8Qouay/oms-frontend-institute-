<template>
    <div class="relative inline-block text-left">
        <button @click="isOpen = !isOpen"
            class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
            Actions
            <Icon name="mdi:chevron-down" class="-mr-1 ml-2 h-4 w-4" />
        </button>

        <div v-show="isOpen" @click.away="isOpen = false"
            class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div class="py-1">
                <button @click="handleAction('update')"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Update Status
                </button>
                <button @click="handleAction('cancel')"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Cancel Order
                </button>
                <button @click="handleAction('override')"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Override
                </button>
                <button @click="handleAction('history')"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    View History
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    order: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update'])

const isOpen = ref(false)

const handleAction = (action: string) => {
    isOpen.value = false
    emit('update', action, props.order)
}
</script>