<script setup lang="ts">
import type { DashboardStatsDto } from '~/utils/types/admin.type'

defineProps<{
    stats: DashboardStatsDto | null
    loading: boolean
}>()
</script>

<template>
    <div class="bg-white p-4 rounded shadow mb-6">
        <h2 class="text-xl font-semibold mb-4">🔹 Key Business Metrics</h2>
        <CommonLoader v-if="loading" isFullScreen preventInteraction />
        <div v-else class="grid grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 rounded">
                <p class="text-gray-600">Revenue</p>
                <p class="text-2xl font-bold">${{ stats?.revenue || 0 }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded">
                <p class="text-gray-600">Orders Today</p>
                <p class="text-2xl font-bold">{{ stats?.ordersToday || 0 }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded">
                <p class="text-gray-600">Popular Item</p>
                <p class="text-2xl font-bold">{{ stats?.popularItem || 'N/A' }}</p>
            </div>
        </div>
    </div>
</template>