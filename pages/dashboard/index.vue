<template>
    <div class="admin">
        <!-- Page Title -->
        <h1 class="text-2xl font-bold mb-6">📊 Dashboard</h1>

        <!-- <CommonLoader v-if="isStatsLoading" isFullScreen preventInteraction /> -->

        <!-- Key Metrics -->
        <DashboardMetrics />

        <!-- AI Insights -->
        <DashboardAIInsights :data="aiInsights" :loading="isAiInsightsLoading" />

        <!-- Charts -->
        <DashboardCharts :revenue="revenueData" :popularItems="popularItemsData"
            :loading="isRevenueLoading || isPopularItemsLoading" />

        <!-- Menu Management -->
        <DashboardMenuManagement />
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
const aiInsights = ref<any>(null)

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

// Fetch AI insights
const { isLoading: isAiInsightsLoading, execute: fetchAiInsights } = useAxios(
    ENDPOINTS.ADMIN_DASHBOARD.GET_AI_INSIGHTS,
    { method: 'GET' },
    $api,
    {
        initialData: [],
        immediate: false,
        onSuccess(data) {
            aiInsights.value = data
            console.log('Fetched ai insights: ', data)
        },
        onError(err) {
            console.error('Failed to fetch AI insights:', err)
        },
    }
)

// Fetch all data on page load
onMounted(() => {
    fetchRevenue()
    fetchPopularItems()
    fetchAiInsights()
})
</script>