<script setup lang="ts">
const notifications = ref<string[]>([])

// Fetch notifications (example)
onMounted(() => {
    notifications.value = [
        'New order received!',
        'Low stock alert: Fries',
        'System update available',
    ]
})
</script>

<template>
    <div class="relative">
        <button class="p-2 bg-gray-200 rounded">🔔 Notifications</button>
        <div v-if="notifications.length" class="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg">
            <ul class="p-2">
                <li v-for="(notification, index) in notifications" :key="index" class="p-2 hover:bg-gray-50">
                    {{ notification }}
                </li>
            </ul>
        </div>
    </div>
</template>