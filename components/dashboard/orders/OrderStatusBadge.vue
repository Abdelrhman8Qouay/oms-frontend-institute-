<template>
    <span :class="badgeClasses" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
        <span :class="pulseClasses" class="flex-shrink-0 h-2 w-2 rounded-full mr-1.5"></span>
        {{ statusText }}
        <template v-if="showIcon">
            <Icon :name="statusIcon" class="ml-1 w-3 h-3" />
        </template>
    </span>
</template>

<script setup lang="ts">
import { OrderStatus } from '~/utils/types/order.type'
import { computed } from 'vue'

const props = defineProps({
    status: {
        type: String as () => OrderStatus,
        required: true
    },
    showIcon: {
        type: Boolean,
        default: false
    }
})

const statusText = computed(() => {
    const statusMap = {
        [OrderStatus.PENDING]: 'Pending',
        [OrderStatus.IN_PROGRESS]: 'In Progress',
        [OrderStatus.COMPLETED]: 'Completed',
        [OrderStatus.DELIVERED]: 'Delivered',
        [OrderStatus.CANCELLED]: 'Cancelled',
        [OrderStatus.FAILED]: 'Failed'
    }
    return statusMap[props.status] || props.status
})

const statusIcon = computed(() => {
    const iconMap = {
        [OrderStatus.PENDING]: 'clock',
        [OrderStatus.IN_PROGRESS]: 'refresh',
        [OrderStatus.COMPLETED]: 'check',
        [OrderStatus.DELIVERED]: 'truck',
        [OrderStatus.CANCELLED]: 'x',
        [OrderStatus.FAILED]: 'alert-circle'
    }
    return iconMap[props.status] || 'info'
})

const badgeClasses = computed(() => {
    const classesMap = {
        [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
        [OrderStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
        [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
        [OrderStatus.DELIVERED]: 'bg-purple-100 text-purple-800',
        [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
        [OrderStatus.FAILED]: 'bg-gray-100 text-gray-800'
    }
    return classesMap[props.status] || 'bg-gray-100 text-gray-800'
})

const pulseClasses = computed(() => {
    const classesMap = {
        [OrderStatus.PENDING]: 'bg-yellow-400',
        [OrderStatus.IN_PROGRESS]: 'bg-blue-400',
        [OrderStatus.COMPLETED]: 'bg-green-400',
        [OrderStatus.DELIVERED]: 'bg-purple-400',
        [OrderStatus.CANCELLED]: 'bg-red-400',
        [OrderStatus.FAILED]: 'bg-gray-400'
    }
    return classesMap[props.status] || 'bg-gray-400'
})
</script>