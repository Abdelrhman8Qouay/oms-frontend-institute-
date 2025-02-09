<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Header -->
        <header class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-900">Cashier Dashboard</h1>
                    <div class="flex space-x-4">
                        <button v-for="type in Object.values(OrderTypes)" :key="type" :class="[
                            'px-4 py-2 rounded-md',
                            orderType === OrderTypes.DINE_IN ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700',
                        ]" @click="setOrderType(type)">
                            {{ formatReadableText(type) }}
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
                    <div v-if="isMenuLoading" class="w-full">
                        <span>Loading...</span>
                        <CommonLoader :size="'30px'" animationType="pulse" />
                    </div>
                    <div v-else-if="!isMenuLoading && Object.keys(currentMenu).length === 0" class="w-full h-max">
                        <span>Menu Is not Available now "-"</span>
                    </div>
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
                                    <p class="text-gray-600">${{ fixedFraction(item.price, 2) }}</p>
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
                                    <p class="text-gray-600">${{ fixedFraction(item.price, 2) }}</p>
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
                                <span>${{ fixedFraction(total, 2) }}</span>
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
        <CashierCustomerDetailsModal v-if="showCustomerModal" :customerDetails="customerDetails"
            :isDelivery="isDelivery" @close="showCustomerModal = false" @submit="handleCustomerDetails" />

        <div v-if="submitIsLoading">
            <CommonLoader :isFullScreen="true" :preventInteraction="true" animationType="rotate" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { CustomerDetails, SelectedItem } from '~/utils/types/cashier.type';
import { OrderTypes } from '~/utils/types/order.type';
import type { MenuObject, MenuItem, MenuCategory } from '~/utils/types/menu.type';
import { fixedFraction, formatReadableText } from '~/utils/functions/format';
import { useAxios } from '@vueuse/integrations/useAxios.mjs';
import { ENDPOINTS } from '~/utils/constants/apiEndpoints';
import type { AxiosInstance } from 'axios';

const { $api } = useNuxtApp() as { $api: AxiosInstance } // Access Axios from plugin

const menuStore = useMenuStore()
const orderTypes = [...Object.values(OrderTypes)];

// State
const currentMenu = ref<MenuObject>({});
const currentCategory = ref<MenuCategory>({});
const currentMenuId = ref<string>('')
const selectedItems = ref<SelectedItem[]>([]);
const customerDetails = ref<CustomerDetails>({
    name: '',
    phone: '',
    address: '',
});
const orderType = ref<OrderTypes>(OrderTypes.DINE_IN);
const showCustomerModal = ref<boolean>(false);

// Computed
const total = computed(() => {
    return selectedItems.value.reduce((sum, item) => sum + item.totalPrice, 0);
});

const isDelivery = computed(() => orderType.value === OrderTypes.DELIVERY);

const canSubmitOrder = computed(() => {
    if (selectedItems.value.length === 0) return false;
    if (isDelivery.value && !customerDetails.value.name) return false;
    return true;
});

// Actions
const { isLoading: isMenuLoading, execute: executeCurrentMenu } = useAxios(ENDPOINTS.CASHIER.CURRENT_CASHIER_MENU(currentMenuId.value), { method: 'GET' }, $api, {
    initialData: {}, immediate: false,
    onError(err) {
        console.error('Failed to fetch current menu:', err);
        throw err;
    },
    onSuccess(data) {
        // Ensure the data is valid
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid menu data returned from the API');
        }

        // Update the current menu and cache
        currentMenu.value = data as MenuObject
        menuStore.menuCache.cashier.set(currentMenu.value as MenuObject)
        menuStore.menuIdCache.cashier.set(currentMenu.value.id as string)

        // Select the first category by default
        if (currentMenu.value.categories?.length) {
            currentCategory.value = currentMenu.value.categories[0];
        }
    },
})

async function fetchCurrentMenu() {
    // Get cached menu if exists
    const cachedData = menuStore.menuCache.cashier.get();
    if (Object.keys(cachedData).length !== 0) {
        currentMenu.value = cachedData;
        return;
    }

    // Get menu by menu_id if exists
    currentMenuId.value = menuStore.menuIdCache.cashier.get();
    if (!currentMenuId.value) {
        currentMenuId.value = crypto.randomUUID(); // Generate a new UUID if no menuId is cached
        console.warn('Cache Empty: replaced Empty menu_id with New id');
    }
    await executeCurrentMenu(ENDPOINTS.CASHIER.CURRENT_CASHIER_MENU(currentMenuId.value))
}

function addItem(item: MenuItem) {
    const existingItem = selectedItems.value.find((i) => i.id === item.id);
    if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
    } else {
        selectedItems.value.push({
            ...item,
            quantity: 1,
            totalPrice: item.price,
        });
    }
}

function removeItem(itemId: string) {
    selectedItems.value = selectedItems.value.filter((item) => item.id !== itemId);
}

function updateItemQuantity(itemId: string, quantity: number) {
    const item = selectedItems.value.find((i) => i.id === itemId);
    if (item) {
        if (quantity <= 0) {
            removeItem(itemId);
        } else {
            item.quantity = quantity;
            item.totalPrice = item.price * quantity;
        }
    }
}

function setCustomerDetails(details: CustomerDetails) {
    customerDetails.value = details;
}

function setOrderType(type: OrderTypes) {
    orderType.value = type;
    if (type !== OrderTypes.DELIVERY) {
        customerDetails.value = {
            name: '',
            phone: '',
            address: '',
        };
    }
}

function selectCategory(category: MenuCategory) {
    currentCategory.value = category;
}


const { isLoading: submitIsLoading, execute: executeSubmission } = useAxios(ENDPOINTS.CASHIER.CREATE_ORDER, {}, $api, {
    initialData: {}, immediate: false,
    onSuccess(data) {
        // Reset state after successful order
        resetStateOrder();
    },
})

async function submitOrder() {
    if (!canSubmitOrder.value) return;

    try {
        await executeSubmission(
            {
                data: {
                    type: orderType.value,
                    items: selectedItems.value.map((item) => ({
                        menuItemId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice,
                    })),
                    customerDetails: customerDetails.value,
                    totalPrice: total.value,
                }, method: 'POST'
            },
        );
    } catch (err) {
        console.error('Failed to submit order:', err);
        throw err;
    }
}

function resetStateOrder() {
    selectedItems.value = [];
    customerDetails.value = {
        name: '',
        phone: '',
        address: '',
    };
    orderType.value = OrderTypes.DINE_IN;
}

// Lifecycle
onMounted(async () => {
    await fetchCurrentMenu();
});

watchEffect(() => {
    console.log(total.value)
    console.log('###########################')
})

function handleCustomerDetails(details: CustomerDetails) {
    setCustomerDetails(details);
    showCustomerModal.value = false;
}
</script>