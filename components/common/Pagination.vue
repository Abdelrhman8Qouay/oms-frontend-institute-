<template>
    <div class="px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <!-- Mobile pagination controls -->
        <div class="flex-1 flex justify-between sm:hidden">
            <button :disabled="currentPage === 1" @click="handlePrevPage"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
            </button>
            <button :disabled="currentPage >= totalPages" @click="handleNextPage"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
            </button>
        </div>

        <!-- Desktop pagination display and controls -->
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <!-- Results summary -->
            <div v-if="showSummary">
                <p class="text-sm text-gray-700">
                    Showing <span class="font-medium">{{ firstItemIndex }}</span>
                    to <span class="font-medium">{{ lastItemIndex }}</span>
                    of <span class="font-medium">{{ totalItems }}</span> results
                </p>
            </div>

            <CommonDropdown title="Items Per Page">
                <div class="block px-4 py-2 text-sm text-gray-700 hover:text-gray-500 w-full text-left cursor-pointer"
                    @click="handlePerPageChange(num)" v-for="(num, index) in [5, 10, 15, 20]" :key="index">
                    {{ num }}
                </div>
            </CommonDropdown>

            <!-- Page number navigation -->
            <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <!-- Previous page button -->
                    <button :disabled="currentPage === 1" @click="handlePrevPage"
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span class="sr-only">Previous</span>
                        <component :is="iconComponent" :name="prevIcon" class="h-5 w-5" v-if="iconComponent" />
                        <span v-else>&lt;</span>
                    </button>

                    <!-- First page (if needed) -->
                    <button v-if="showFirstPage && visiblePages[0] > 1" @click="handlePageChange(1)"
                        class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        1
                    </button>

                    <!-- Ellipsis after first page (if needed) -->
                    <span v-if="showFirstPage && visiblePages[0] > 2"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                    </span>

                    <!-- Visible page buttons -->
                    <button v-for="page in visiblePages" :key="page" @click="handlePageChange(page)" :class="{
                        'z-10 bg-blue-50 border-blue-500 text-blue-600': page === currentPage,
                        'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': page !== currentPage
                    }" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        {{ page }}
                    </button>

                    <!-- Ellipsis before last page (if needed) -->
                    <span v-if="showLastPage && visiblePages[visiblePages.length - 1] < totalPages - 1"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                    </span>

                    <!-- Last page (if needed) -->
                    <button v-if="showLastPage && visiblePages[visiblePages.length - 1] < totalPages"
                        @click="handlePageChange(totalPages)"
                        class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        {{ totalPages }}
                    </button>

                    <!-- Next page button -->
                    <button :disabled="currentPage >= totalPages" @click="handleNextPage"
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span class="sr-only">Next</span>
                        <component :is="iconComponent" :name="nextIcon" class="h-5 w-5" v-if="iconComponent" />
                        <span v-else>&gt;</span>
                    </button>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    // Required props
    totalItems: {
        type: Number,
        required: true
    },
    pageSize: {
        type: Number,
        default: 10
    },
    modelValue: {
        type: Number,
        default: 1
    },

    // Optional customization props
    maxVisiblePages: {
        type: Number,
        default: 5
    },
    showSummary: {
        type: Boolean,
        default: true
    },
    showFirstPage: {
        type: Boolean,
        default: true
    },
    showLastPage: {
        type: Boolean,
        default: true
    },

    // Icon customization
    iconComponent: {
        type: [String, Object],
        default: 'Icon'
    },
    nextIcon: {
        type: String,
        default: 'mdi:chevron-right'
    },
    prevIcon: {
        type: String,
        default: 'mdi:chevron-left'
    }
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
    (e: 'per-change', pageSize: number): void
    (e: 'page-change', page: number): void
}>()

// Calculate total number of pages
const totalPages = computed(() => {
    return Math.max(1, Math.ceil(props.totalItems / props.pageSize))
})

// Current page (sync with v-model)
const currentPage = computed({
    get() {
        return props.modelValue
    },
    set(value: number) {
        emit('update:modelValue', value)
    }
})

// Calculate visible page range
const visiblePages = computed(() => {
    if (totalPages.value <= props.maxVisiblePages) {
        // If we have fewer pages than max visible, show all pages
        return Array.from({ length: totalPages.value }, (_, i) => i + 1)
    }

    // Calculate the middle point for the current page
    const half = Math.floor(props.maxVisiblePages / 2)
    let start = currentPage.value - half
    let end = currentPage.value + half

    // Adjust if we're near the beginning
    if (start < 1) {
        end += (1 - start)
        start = 1
    }

    // Adjust if we're near the end
    if (end > totalPages.value) {
        start -= (end - totalPages.value)
        end = totalPages.value
    }

    // Ensure start is not less than 1
    start = Math.max(1, start)

    // Generate the array of visible page numbers
    return Array.from(
        { length: Math.min(props.maxVisiblePages, end - start + 1) },
        (_, i) => start + i
    )
})

// Calculate first item index for summary
const firstItemIndex = computed(() => {
    if (props.totalItems === 0) return 0
    return (currentPage.value - 1) * props.pageSize + 1
})

// Calculate last item index for summary
const lastItemIndex = computed(() => {
    return Math.min(currentPage.value * props.pageSize, props.totalItems)
})

// Handle page changes with validation
const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    emit('page-change', page)
}

const handlePerPageChange = (pageSize: number) => {
    if (pageSize < 1) return
    emit('per-change', pageSize)
}

// Handle previous page navigation
const handlePrevPage = () => {
    if (currentPage.value > 1) {
        handlePageChange(currentPage.value - 1)
    }
}

// Handle next page navigation
const handleNextPage = () => {
    if (currentPage.value < totalPages.value) {
        handlePageChange(currentPage.value + 1)
    }
}
</script>