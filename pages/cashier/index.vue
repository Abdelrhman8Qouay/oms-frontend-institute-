<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Header -->
        <header class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-900">Cashier Dashboard</h1>
                    <div class="flex space-x-4">
                        <button v-for="type in orderTypes" :key="type" :class="[
                            'px-4 py-2 rounded-md',
                            orderType === type ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700',
                        ]" @click="setOrderType(type)">
                            {{ type }}
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 py-6">
            <div class="grid grid-cols-12 gap-6">
                <!-- Left Side - Menu -->
                <div class="col-span-8">
                    <div v-if="isMenuLoading" class="w-full">Loading...</div>
                    <div v-else class="w-full">
                        <!-- Categories -->
                        <div class="bg-white p-4 rounded-lg shadow mb-6">
                            <h2 class="text-lg font-semibold mb-4">Categories</h2>
                            <div class="flex space-x-4 overflow-x-auto">
                                <button v-for="category in currentMenu?.categories" :key="category.id" :class="[
                                    'px-4 py-2 rounded-md whitespace-nowrap',
                                    currentCategory?.id === category.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700',
                                ]" @click="selectCategory(category)">
                                    {{ category.name }}
                                </button>
                            </div>
                        </div>

                        <!-- Items -->
                        <div class="bg-white p-4 rounded-lg shadow">
                            <h2 class="text-lg font-semibold mb-4">Items</h2>
                            <div class="grid grid-cols-3 gap-4">
                                <div v-for="item in currentMenu?.categories?.find(
                                    (cat) => cat.id === currentCategory?.id
                                )?.items" :key="item.id" class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                                    @click="addItem(item)">
                                    <h3 class="font-medium">{{ item.name }}</h3>
                                    <p class="text-gray-600">${{ item.price.toFixed(2) }}</p>
                                    <p v-if="item.preparationTime" class="text-sm text-gray-500">
                                        Prep Time: {{ item.preparationTime }} mins
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Side - Order Summary -->
                <div class="col-span-4">
                    <div class="bg-white p-4 rounded-lg shadow sticky top-4">
                        <h2 class="text-lg font-semibold mb-4">Selected Items</h2>

                        <!-- Customer Details Button -->
                        <button v-if="isDelivery" class="w-full mb-4 px-4 py-2 bg-gray-200 rounded-md"
                            @click="showCustomerModal = true">
                            {{ customerDetails.name ? 'Update Customer Details' : 'Add Customer Details' }}
                        </button>

                        <!-- Selected Items List -->
                        <div class="space-y-4 mb-4">
                            <div v-for="item in selectedItems" :key="item.id" class="flex justify-between items-center">
                                <div>
                                    <h3 class="font-medium">{{ item.name }}</h3>
                                    <p class="text-gray-600">${{ item.price.toFixed(2) }}</p>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button class="px-2 py-1 bg-gray-200 rounded"
                                        @click="updateItemQuantity(item.id, item.quantity - 1)">
                                        -
                                    </button>
                                    <span>{{ item.quantity }}</span>
                                    <button class="px-2 py-1 bg-gray-200 rounded"
                                        @click="updateItemQuantity(item.id, item.quantity + 1)">
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Total -->
                        <div class="border-t pt-4">
                            <div class="flex justify-between text-lg font-semibold">
                                <span>Total:</span>
                                <span>${{ total.toFixed(2) }}</span>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button type="button"
                            class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
                            :disabled="!canSubmitOrder" @click="submitOrder">
                            Submit Order
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <!-- Customer Details Modal -->
        <CustomerDetailsModal v-if="showCustomerModal" @close="showCustomerModal = false"
            @submit="handleCustomerDetails" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCashierStore } from '~/stores/cashier.store';
import CustomerDetailsModal from '~/components/common/CustomerDetailsModal.vue';
import type { CustomerDetails } from '~/utils/types/cashier.type';
import type { MenuCategory } from '~/utils/types/menu.type';

const cashierStore = useCashierStore();
const showCustomerModal = ref(false);

const {
    currentMenu,
    currentCategory,
    selectedItems,
    customerDetails,
    orderTypes,
    orderType,
    total,
    canSubmitOrder,
    isDelivery,
    isMenuLoading,
} = storeToRefs(cashierStore);

const {
    addItem,
    updateItemQuantity,
    setOrderType,
    submitOrder,
    setCustomerDetails,
    fetchCurrentMenu,
    selectCategory,
} = cashierStore;

onMounted(async () => {
    await fetchCurrentMenu();
});

function handleCustomerDetails(details: CustomerDetails) {
    setCustomerDetails(details);
    showCustomerModal.value = false;
}
</script>