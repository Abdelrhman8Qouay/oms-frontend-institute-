<template>
    <div class="space-y-2">
        <h3 class="font-semibold">Order #{{ order.id }}</h3>
        <p>Type: {{ order.type }}</p>
        <p>Items: {{ order.items.map((item: any) => formatReadableText(item.name)).join(', ') }}</p>
        <p>Total: ${{ fixedFraction(order.totalPrice, 2) }}</p>
        <div class="flex space-x-2">
            <button v-if="order.status === OrderStatus.PENDING" class="px-2 py-1 bg-blue-600 rounded"
                @click="$emit('claim-order', order.id)">
                Claim Order
            </button>
            <button v-if="order.status === OrderStatus.IN_PROGRESS" class="px-2 py-1 bg-green-600 rounded"
                @click="$emit('complete-order', order.id)">
                Complete Order
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { fixedFraction, formatReadableText } from '~/utils/functions/format';
import { OrderStatus } from '~/utils/types/order.type';

defineProps({
    order: {
        type: Object,
        required: true,
    },
});

defineEmits(['claim-order', 'complete-order']);
</script>