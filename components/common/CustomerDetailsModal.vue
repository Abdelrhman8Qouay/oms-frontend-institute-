<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 class="text-xl font-semibold mb-4">Customer Details</h2>

            <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <!-- Name Input -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Name</label>
                        <input v-model="formData.name" type="text" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>

                    <!-- Phone Input -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Phone</label>
                        <input v-model="formData.phone" type="tel" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>

                    <!-- Address Input -->
                    <div v-if="isDelivery">
                        <label class="block text-sm font-medium text-gray-700">Delivery Address</label>
                        <textarea v-model="formData.address" required rows="3"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                </div>

                <!-- Form Actions -->
                <div class="mt-6 flex justify-end space-x-3">
                    <button type="button" class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                        @click="$emit('close')">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Save Details
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
    initialDetails?: {
        name?: string
        phone?: string
        address?: string
    } | null
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'submit', details: { name: string; phone: string; address?: string }): void
}>()

const formData = ref({
    name: props.initialDetails?.name || '',
    phone: props.initialDetails?.phone || '',
    address: props.initialDetails?.address || ''
})

const isDelivery = computed(() => store.orderType === 'delivery')

function handleSubmit() {
    emit('submit', {
        name: formData.value.name,
        phone: formData.value.phone,
        address: isDelivery.value ? formData.value.address : undefined
    })
}
</script>