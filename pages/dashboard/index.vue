<template>
    <div class="admin">
        <!-- Page Title -->
        <h1 class="text-2xl font-bold text-gray-800 mb-4">
            <Icon name="material-symbols-light:dashboard" mode="svg" size="30" class="stroke-white inline-block" />
            Dashboard
        </h1>

        <!-- <CommonLoader v-if="isStatsLoading" isFullScreen preventInteraction /> -->

        <!-- Key Metrics -->
        <DashboardMetrics />

        <!-- Charts -->
        <DashboardCharts :revenue="revenueData" :popularItems="popularItemsData"
            :loading="isRevenueLoading || isPopularItemsLoading" />

        <!-- AI Insights -->
        <DashboardAIInsights />

        <!-- Menu Management -->
        <!-- <DashboardMenuManagement /> -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAxios } from '@vueuse/integrations/useAxios'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'
import type { PopularItemDto, RevenueAnalyticsDto } from '~/utils/types/admin.type'

definePageMeta({
    layout: 'admin',
})

const { $api } = useNuxtApp()

// Reactive state for dashboard data
const revenueData = ref<RevenueAnalyticsDto | null>(null)
const popularItemsData = ref<PopularItemDto[]>([])

// Fetch revenue analytics
const { isLoading: isRevenueLoading, execute: fetchRevenue } = useAxios(
    ENDPOINTS.ADMIN_DASHBOARD.GET_REVENUE,
    { method: 'GET' },
    $api,
    {
        initialData: null,
        immediate: false,
        onSuccess(data) {
            revenueData.value = data
            console.log('Fetched revenue: ', data)
        },
        onError(err) {
            console.error('Failed to fetch revenue analytics:', err)
        },
    }
)

// Fetch popular items
const { isLoading: isPopularItemsLoading, execute: fetchPopularItems } = useAxios(
    ENDPOINTS.ADMIN_DASHBOARD.GET_POPULAR_ITEMS,
    { method: 'GET' },
    $api,
    {
        initialData: [],
        immediate: false,
        onSuccess(data) {
            popularItemsData.value = data
            console.log('Fetched popular: ', data)
        },
        onError(err) {
            console.error('Failed to fetch popular items:', err)
        },
    }
)

// Fetch all data on page load
onMounted(() => {
    fetchRevenue()
    fetchPopularItems()
})
</script>