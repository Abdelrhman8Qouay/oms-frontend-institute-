<script setup lang="ts">

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

const props = defineProps<{
    data: any
    loading: boolean
}>()

</script>

<template>
    <div class="bg-white p-4 rounded shadow mb-6">
        <h2 class="text-2xl font-bold mb-4">
            <Icon name="mdi:star-four-points" />
            AI Insights & Business Suggestions
        </h2>
        <CommonLoader v-if="loading" />
        <div v-else-if="!props.data">
            <div class="w-full rounded-md bg-red-500/50 border border-blue-500 px-2 py-1">
                <p class="text-sm opacity-70">AI Insights Error Response, got something wrong please try later.</p>
            </div>
        </div>
        <div v-else class="w-full">
            <ul class="space-y-2 px-5 py-2">
                <li v-for="insight in props.data.insights.insights as AIInsight[]" :key="insight.id"
                    class="flex items-center gap-2">
                    <span>
                        <Icon name="mdi:rhombus-split-outline" />
                    </span>
                    <p>{{ insight.message }}</p>
                </li>
            </ul>
            <div class="w-full rounded-md bg-blue-500/50 border border-blue-500 px-2 py-1">
                <h4 class="text-lg font-semibold">System Recommendations</h4>
                <p class="text-sm opacity-70" v-for="(rec, i) in props.data.insights.recommendations" :key="i"> > {{ rec
                    }}
                </p>
            </div>
        </div>
    </div>
</template>