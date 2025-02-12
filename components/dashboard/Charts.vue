<script setup lang="ts">
import { Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js'
import { computed } from 'vue'
import type { PopularItemDto, RevenueAnalyticsDto } from '~/utils/types/admin.type'

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement)

const props = defineProps<{
    revenue: RevenueAnalyticsDto | null
    popularItems: PopularItemDto[]
    loading: boolean
}>()

// Prepare data for charts
const revenueChartData = computed(() => ({
    labels: props.revenue?.labels || [], // e.g., ['Mon', 'Tue', 'Wed']
    datasets: [
        {
            label: 'Revenue',
            data: props.revenue?.data || [], // e.g., [100, 200, 150]
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
        },
    ],
}))

const popularItemsChartData = computed(() => ({
    labels: props.popularItems.map((item) => item.name), // e.g., ['Burger', 'Pizza']
    datasets: [
        {
            label: 'Popular Items',
            data: props.popularItems.map((item) => item.quantity), // e.g., [50, 30]
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 1,
        },
    ],
}))
</script>

<template>
    <div class="bg-white p-4 rounded shadow mb-6">
        <h2 class="text-xl font-semibold mb-4">🔹 Charts</h2>
        <CommonLoader v-if="loading" isFullScreen preventInteraction />
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Revenue Chart -->
            <div>
                <h3 class="text-lg font-medium mb-2">📈 Revenue by Week</h3>
                <Line :data="revenueChartData" />
            </div>

            <!-- Popular Items Chart -->
            <div>
                <h3 class="text-lg font-medium mb-2">🍔 Popular Items</h3>
                <Bar :data="popularItemsChartData" />
            </div>
        </div>
    </div>
</template>