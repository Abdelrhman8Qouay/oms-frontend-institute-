<script setup lang="ts">
import { Icon } from '#components';
import type { DashboardStatsDto } from '~/utils/types/admin.type'

const props = defineProps<{
    stats: DashboardStatsDto | null
    loading: boolean
}>()

const mapped = [
    {
        title: 'Today Stats',
        mets: [
            ['Revenue', props.stats?.revenue || 0],
            ['Orders', props.stats?.ordersToday || 0],
            ['Items', props.stats?.popularItem || 'N/A'],
        ]
    },
    {
        title: 'Total Stats',
        mets: [
            ['Revenue', props.stats?.revenue || 0],
            ['Orders', props.stats?.ordersToday || 0],
            ['Items', props.stats?.popularItem || 'N/A'],
        ]
    }
]
</script>

<template>
    <div class="bg-white p-4 rounded shadow mb-6">
        <h2 class="text-2xl font-semibold mb-4">
            <Icon name="mdi:octahedron" />
            Key Business Metrics
        </h2>
        <CommonLoader v-if="loading" isFullScreen preventInteraction />
        <div v-else class="w-full">
            <div class="w-full" v-for="(metrics, index) in mapped" :key="index">
                <h2 class="text-lg font-semibold mb-4">{{ metrics.title }}</h2>
                <div class="grid grid-cols-3 gap-4">
                    <div class="p-4 bg-gray-50 rounded" v-for="(item, j) in metrics.mets" :key="j">
                        <p class="text-gray-600">{{ item[0] }}</p>
                        <p class="text-2xl font-bold">${{ item[1] }}</p>
                    </div>
                </div>
            </div>
            <!-- <h2 class="text-lg font-semibold mb-4">Total Stats</h2>
            <div class="grid grid-cols-3 gap-4">
                <div class="p-4 bg-gray-50 rounded">
                    <p class="text-gray-600">Revenue</p>
                    <p class="text-2xl font-bold">${{ stats?.revenue || 0 }}</p>
                </div>
                <div class="p-4 bg-gray-50 rounded">
                    <p class="text-gray-600">Orders</p>
                    <p class="text-2xl font-bold">{{ stats?.ordersToday || 0 }}</p>
                </div>
                <div class="p-4 bg-gray-50 rounded">
                    <p class="text-gray-600">Item</p>
                    <p class="text-2xl font-bold">{{ stats?.popularItem || 'N/A' }}</p>
                </div>
            </div>
            <hr>
            <h2 class="text-lg font-semibold mb-4">Today Stats</h2>
            <div class="grid grid-cols-3 gap-4">
                <div class="p-4 bg-gray-50 rounded">
                    <p class="text-gray-600">Revenue</p>
                    <p class="text-2xl font-bold">${{ stats?.revenue || 0 }}</p>
                </div>
                <div class="p-4 bg-gray-50 rounded">
                    <p class="text-gray-600">Orders</p>
                    <p class="text-2xl font-bold">{{ stats?.ordersToday || 0 }}</p>
                </div>
                <div class="p-4 bg-gray-50 rounded">
                    <p class="text-gray-600">Popular Item</p>
                    <p class="text-2xl font-bold">{{ stats?.popularItem || 'N/A' }}</p>
                </div>
            </div> -->
        </div>
    </div>
</template>