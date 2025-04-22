<script setup lang="ts">
import type { AIInsight } from '~/utils/types/admin.type'

defineProps<{
    insights: AIInsight[]
    loading: boolean
}>()
</script>

<template>
    <div class="bg-white p-4 rounded shadow mb-6">
        <h2 class="text-xl font-semibold mb-4">🔹 AI Insights & Business Suggestions</h2>
        <CommonLoader v-if="loading" />
        <ul v-else class="space-y-2">
            <li v-for="insight in insights" :key="insight.id" class="flex items-center gap-2">
                <span>📢</span>
                <p>{{ insight.message }}</p>
            </li>
        </ul>
    </div>
</template>