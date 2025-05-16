<script setup lang="ts">
import { useAxios } from '@vueuse/integrations/useAxios.mjs'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'


interface AIInsight {
    id: string
    message: string
    type: AIInsightTypes
    createdAt: Date
}

enum AIInsightTypes {
    WARNING = 'warning',
    INFO = 'info',
    SUCCESS = 'success',
    ERROR = 'error',
}

// Types for AI Insights
interface AIInsight {
    id: string
    message: string
    type: AIInsightTypes
    createdAt: Date
}


const { $api } = useNuxtApp()

const aiInsights = ref<any>(null)

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
    fetchAiInsights()
})
</script>

<template>
    <div class="bg-white p-4 rounded shadow mb-6">
        <h2 class="text-2xl font-bold mb-4">
            <Icon name="mdi:star-four-points" />
            AI Insights & Business Suggestions
        </h2>
        <CommonLoader v-if="isAiInsightsLoading" />
        <div v-else-if="!aiInsights">
            <div class="w-full rounded-md bg-red-500/50 border border-blue-500 px-2 py-1">
                <p class="text-sm opacity-70 inline-block mr-2">AI Insights Error Response, got something wrong please
                    try
                    again.</p>
                <button class="inline-flex items-center bg-transparent text-gray-500 rounded-lg"
                    @click="fetchAiInsights()">Retry</button>
            </div>
        </div>
        <div v-else class="w-full">
            <ul class="space-y-2 px-5 py-2">
                <li v-for="insight in aiInsights.insights.insights as AIInsight[]" :key="insight.id"
                    class="flex items-center gap-2">
                    <span>
                        <Icon name="mdi:rhombus-split-outline" />
                    </span>
                    <p>{{ insight.message }}</p>
                </li>
            </ul>
            <div class="w-full rounded-md bg-blue-500/50 border border-blue-500 px-2 py-1">
                <h4 class="text-lg font-semibold">System Recommendations</h4>
                <p class="text-sm opacity-70" v-for="(rec, i) in aiInsights.insights.recommendations" :key="i"> > {{ rec
                    }}
                </p>
            </div>
        </div>
    </div>
</template>