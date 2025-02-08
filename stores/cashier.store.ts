import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CustomerDetails, SelectedItem } from '~/utils/types/cashier.type'
import { OrderTypes } from '~/utils/types/order.type'
import { useApi } from '~/composables/useApi'
import type { AxiosRequestConfig } from 'axios'
import { useCache } from '~/composables/useCache'
import type { MenuObject, MenuItem, MenuCategory } from '~/utils/types/menu.type'

export const useCashierStore = defineStore('cashier', () => {
    const menuStore = useMenuStore()

    // State
    const currentMenu = ref<MenuObject>({})
    const currentCategory = ref<MenuCategory>({})
    const selectedItems = ref<SelectedItem[]>([])
    const customerDetails = ref<CustomerDetails>({
        name: '',
        phone: '',
        address: '',
    })
    const orderType = ref<OrderTypes>(OrderTypes.DINE_IN)
    const isMenuLoading = ref(false)

    // Computed
    const orderTypes = computed(() => Object.values(OrderTypes))

    const total = computed(() => {
        return selectedItems.value.reduce((sum, item) => sum + item.totalPrice, 0)
    })

    const isDelivery = computed(() => orderType.value === OrderTypes.DELIVERY)

    const canSubmitOrder = computed(() => {
        if (selectedItems.value.length === 0) return false
        if (isDelivery.value && !customerDetails.value.name) return false
        return true
    })

    // Actions
    async function fetchCurrentMenu() {
        isMenuLoading.value = true
        try {
            const menuId = menuStore.menuIdCache.cashier.get()
            const { data } = await useApi().cashier.getCurrentMenu<MenuObject>(menuId)

            // Ensure the data is valid
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid menu data returned from the API')
            }

            // Update the current menu and cache
            currentMenu.value = data as MenuObject
            menuStore.menuCache.cashier.set(currentMenu.value as MenuObject)
            menuStore.menuIdCache.cashier.set(currentMenu.value.id as string)

            // Select the first category by default
            if (currentMenu.value.categories?.length) {
                currentCategory.value = currentMenu.value.categories[0]
            }
        } catch (err) {
            console.error('Failed to fetch current menu:', err)
            throw err
        } finally {
            isMenuLoading.value = false
        }
    }

    function addItem(item: MenuItem) {
        const existingItem = selectedItems.value.find((i) => i.id === item.id)
        if (existingItem) {
            existingItem.quantity++
            existingItem.totalPrice = existingItem.price * existingItem.quantity
        } else {
            selectedItems.value.push({
                ...item,
                quantity: 1,
                totalPrice: item.price,
            })
        }
    }

    function removeItem(itemId: string) {
        selectedItems.value = selectedItems.value.filter((item) => item.id !== itemId)
    }

    function updateItemQuantity(itemId: string, quantity: number) {
        const item = selectedItems.value.find((i) => i.id === itemId)
        if (item) {
            if (quantity <= 0) {
                removeItem(itemId)
            } else {
                item.quantity = quantity
                item.totalPrice = item.price * quantity
            }
        }
    }

    function setCustomerDetails(details: CustomerDetails) {
        customerDetails.value = details
    }

    function setOrderType(type: OrderTypes) {
        orderType.value = type
        if (type !== OrderTypes.DELIVERY) {
            customerDetails.value = {
                name: '',
                phone: '',
                address: '',
            }
        }
    }

    function selectCategory(category: MenuCategory) {
        currentCategory.value = category
    }

    async function submitOrder() {
        if (!canSubmitOrder.value) return

        try {
            await useApi().cashier.createOrder(
                {
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
                },
                { method: 'POST' }
            )

            // Reset state after successful order
            resetStateOrder()
        } catch (err) {
            console.error('Failed to submit order:', err)
            throw err
        }
    }

    function resetStateOrder() {
        selectedItems.value = []
        customerDetails.value = {
            name: '',
            phone: '',
            address: '',
        }
        orderType.value = OrderTypes.DINE_IN
    }

    return {
        // State
        currentMenu,
        currentCategory,
        selectedItems,
        customerDetails,
        orderType,
        isMenuLoading,

        // Computed
        orderTypes,
        total,
        isDelivery,
        canSubmitOrder,

        // Actions
        fetchCurrentMenu,
        addItem,
        removeItem,
        updateItemQuantity,
        setCustomerDetails,
        setOrderType,
        selectCategory,
        submitOrder,
    }
})
