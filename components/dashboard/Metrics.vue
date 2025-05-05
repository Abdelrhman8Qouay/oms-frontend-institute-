<script setup lang="ts">
import { Icon } from '#components';
import { useAxios } from '@vueuse/integrations/useAxios.mjs';
import { ENDPOINTS } from '~/utils/constants/apiEndpoints';

interface DashboardStatsDto {
    todayRevenue: number
    totalRevenue: number
    todayOrders: number
    totalOrders: number
    todayItemsSold: number
    totalItemsSold: number
}

const { $api } = useNuxtApp()
const stats = ref<DashboardStatsDto | null>(null)

// Fetch dashboard stats
const { isLoading: isStatsLoading, execute: fetchStats } = useAxios(
    ENDPOINTS.ADMIN_DASHBOARD.GET_STATS,
    { method: 'GET' },
    $api,
    {
        initialData: null,
        immediate: false,
        onSuccess(data) {
            stats.value = data
            console.log('Fetched stats: ', data)
        },
        onError(err) {
            console.error('Failed to fetch dashboard stats:', err)
        },
    }
)

const mapped = computed(() => [
    {
        title: 'Today Stats',
        mets: [
            ['Revenue', `$${stats.value?.todayRevenue || 0}`],
            ['Items Sold', stats.value?.todayItemsSold || 'N/A'],
            ['Orders', stats.value?.todayOrders || 0],
        ]
    },
    {
        title: 'Total Stats',
        mets: [
            ['Revenue', `$${stats.value?.totalRevenue || 0}`],
            ['Items Sold', stats.value?.totalItemsSold || 'N/A'],
            ['Orders', stats.value?.totalOrders || 0],
        ]
    }
])

// Fetch all data on page load
onMounted(() => {
    fetchStats()
})
</script>

<template>
    <div class="bg-white p-4 rounded shadow mb-6">
        <h2 class="text-2xl font-bold mb-4">
            <Icon name="mdi:octahedron" />
            Key Business Metrics
        </h2>
        <CommonLoader v-if="isStatsLoading" />
        <div v-else class="w-full">
            <div class="w-full my-2" v-for="(metrics, index) in mapped" :key="index">
                <h2 class="text-lg font-bold mb-4">{{ metrics.title }}</h2>
                <div class="grid grid-cols-3 gap-4">
                    <div class="p-4 bg-gray-50 rounded shadow-xl" v-for="(item, j) in metrics.mets" :key="j">
                        <p class="text-gray-600">{{ item[0] }}</p>
                        <p class="text-2xl font-bold">{{ item[1] }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>