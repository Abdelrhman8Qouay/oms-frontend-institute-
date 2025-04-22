<template>
    <span :class="badgeClasses" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
        <Icon :name="typeIcon" class="mr-1 w-3 h-3" />
        {{ typeText }}
    </span>
</template>

<script setup lang="ts">
import { OrderTypes } from '~/utils/types/order.type'
import { computed } from 'vue'

const props = defineProps({
    type: {
        type: String as () => OrderTypes,
        required: true
    }
})

const typeText = computed(() => {
    const typeMap = {
        [OrderTypes.DINE_IN]: 'Dine In',
        [OrderTypes.TAKEAWAY]: 'Takeaway',
        [OrderTypes.DELIVERY]: 'Delivery'
    }
    return typeMap[props.type] || props.type
})

const typeIcon = computed(() => {
    const iconMap = {
        [OrderTypes.DINE_IN]: 'utensils',
        [OrderTypes.TAKEAWAY]: 'shopping-bag',
        [OrderTypes.DELIVERY]: 'truck'
    }
    return iconMap[props.type] || 'info'
})

const badgeClasses = computed(() => {
    const classesMap = {
        [OrderTypes.DINE_IN]: 'bg-purple-100 text-purple-800',
        [OrderTypes.TAKEAWAY]: 'bg-indigo-100 text-indigo-800',
        [OrderTypes.DELIVERY]: 'bg-teal-100 text-teal-800'
    }
    return classesMap[props.type] || 'bg-gray-100 text-gray-800'
})
</script>