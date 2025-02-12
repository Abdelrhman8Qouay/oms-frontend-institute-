<template>
    <div class="admin">
        <!-- Page Title -->
        <h1 class="text-2xl font-bold mb-6">📊 Dashboard</h1>

        <!-- Key Metrics -->
        <DashboardMetrics :stats="dashboardStats" :loading="isStatsLoading" />

        <!-- AI Insights -->
        <DashboardAIInsights :insights="aiInsights" :loading="isAiInsightsLoading" />

        <!-- Charts -->
        <DashboardCharts :revenue="revenueAnalytics" :popularItems="popularItems"
            :loading="isRevenueLoading || isPopularItemsLoading" />

        <!-- Menu Management -->
        <DashboardMenuManagement />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAxios } from '@vueuse/integrations/useAxios'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'
import type { DashboardStatsDto, PopularItemDto, RevenueAnalyticsDto, AIInsight } from '~/utils/types/admin.type'

definePageMeta({
    layout: 'admin',
})

const { $api } = useNuxtApp()

// Reactive state for dashboard data
const dashboardStats = ref<DashboardStatsDto | null>(null)
const revenueAnalytics = ref<RevenueAnalyticsDto | null>(null)
const popularItems = ref<PopularItemDto[]>([])
const aiInsights = ref<AIInsight[]>([])

// Fetch dashboard stats
const { isLoading: isStatsLoading, execute: fetchStats } = useAxios(
    ENDPOINTS.ADMIN_DASHBOARD.GET_STATS,
    { method: 'GET' },
    $api,
    {
        initialData: null,
        immediate: false,
        onSuccess(data) {
            dashboardStats.value = data
            console.log('Fetched stats: ', data)
        },
        onError(err) {
            console.error('Failed to fetch dashboard stats:', err)
        },
    }
)

// Fetch revenue analytics
const { isLoading: isRevenueLoading, execute: fetchRevenue } = useAxios(
    ENDPOINTS.ADMIN_DASHBOARD.GET_REVENUE,
    { method: 'GET' },
    $api,
    {
        initialData: null,
        immediate: false,
        onSuccess(data) {
            revenueAnalytics.value = data
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
            popularItems.value = data
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
            aiInsights.value = data.insights
            console.log('Fetched ai insights: ', data)
        },
        onError(err) {
            console.error('Failed to fetch AI insights:', err)
        },
    }
)

// Fetch all data on page load
onMounted(() => {
    fetchStats()
    fetchRevenue()
    fetchPopularItems()
    fetchAiInsights()
})
</script>