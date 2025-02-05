import { defineStore } from 'pinia'
import { useAxios } from '@vueuse/integrations/useAxios'
import { ref, computed } from 'vue'

interface CustomerDetails {
    name: string
    phone: string
    address?: string
}

interface MenuItem {
    id: string
    name: string
    price: number
    description?: string
    categoryId: string
    isAvailable: boolean
    preparationTime?: number
    customization?: {
        options?: {
            name: string
            choices: string[]
            price?: number
        }[]
        allergens?: string[]
        dietary?: string[]
    }
}

interface SelectedItem extends MenuItem {
    quantity: number
    totalPrice: number
}

export const useCashierStore = defineStore('cashier', () => {
    const axios = useAxios()

    // State
    const selectedItems = ref<SelectedItem[]>([])
    const customerDetails = ref<CustomerDetails | null>(null)
    const orderType = ref<'dine-in' | 'takeaway' | 'delivery'>('dine-in')
    const categories = ref<{ id: string; name: string; displayOrder: number }[]>([])
    const currentCategory = ref<string | null>(null)
    const categoryItems = ref<MenuItem[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Computed
    const total = computed(() => {
        return selectedItems.value.reduce((sum, item) => sum + item.totalPrice, 0)
    })

    const canSubmitOrder = computed(() => {
        if (selectedItems.value.length === 0) return false
        if (orderType.value === 'delivery' && !customerDetails.value) return false
        return true
    })

    // Actions
    async function fetchCategories(menuId: string) {
        try {
            isLoading.value = true
            const { data } = await useAxios(`/cashier/categories/${menuId}`)
            categories.value = data.sort((a, b) => a.displayOrder - b.displayOrder)
        } catch (err) {
            error.value = 'Failed to fetch categories'
            console.error(err)
        } finally {
            isLoading.value = false
        }
    }

    async function fetchCategoryItems(categoryId: string) {
        try {
            isLoading.value = true
            const { data } = await useAxios(`/cashier/items/${categoryId}`)
            categoryItems.value = data.filter((item: MenuItem) => item.isAvailable)
            currentCategory.value = categoryId
        } catch (err) {
            error.value = 'Failed to fetch items'
            console.error(err)
        } finally {
            isLoading.value = false
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

    function setOrderType(type: 'dine-in' | 'takeaway' | 'delivery') {
        orderType.value = type
        if (type !== 'delivery') {
            customerDetails.value = null
        }
    }

    async function submitOrder() {
        if (!canSubmitOrder.value) return

        try {
            isLoading.value = true
            await useAxios('/cashier/orders', {
                method: 'post',
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
                },
            })

            // Reset state after successful order
            selectedItems.value = []
            customerDetails.value = null
            orderType.value = 'dine-in'
        } catch (err) {
            error.value = 'Failed to submit order'
            console.error(err)
        } finally {
            isLoading.value = false
        }
    }

    return {
        // State
        selectedItems,
        customerDetails,
        orderType,
        categories,
        currentCategory,
        categoryItems,
        isLoading,
        error,

        // Computed
        total,
        canSubmitOrder,

        // Actions
        fetchCategories,
        fetchCategoryItems,
        addItem,
        removeItem,
        updateItemQuantity,
        setCustomerDetails,
        setOrderType,
        submitOrder,
    }
})
