<script setup lang="ts">
import { Bar, Line, Pie } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ArcElement,
    Colors
} from 'chart.js'
import { computed } from 'vue'
import type {
    PopularItemDto,
    RevenueAnalyticsDto,
    // OrderTypeStats
} from '~/utils/types/admin.type'

// Register Chart.js components
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ArcElement,
    Colors
)

const props = defineProps<{
    revenue: RevenueAnalyticsDto | null
    popularItems: PopularItemDto[]
    // orderTypes: OrderTypeStats[]
    // salesByCategory: SalesByCategory[]
    loading: boolean
}>()

// Chart options configuration
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        tooltip: {
            callbacks: {
                label: function (context: any) {
                    let label = context.dataset.label || ''
                    if (label) {
                        label += ': '
                    }
                    if (context.parsed.y !== undefined) {
                        label += new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                        }).format(context.parsed.y)
                    } else if (context.parsed !== undefined) {
                        label += context.parsed
                    }
                    return label
                }
            }
        }
    }
}

// Prepare data for all charts
const charts = computed(() => ({
    revenue: {
        data: {
            labels: props.revenue?.labels || [],
            datasets: [
                {
                    label: 'Revenue',
                    data: props.revenue?.data?.map(item => item.revenue) || [],
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    tension: 0.3
                },
                {
                    label: 'Orders',
                    data: props.revenue?.data?.map(item => item.orders) || [],
                    backgroundColor: 'rgba(16, 185, 129, 0.5)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    tension: 0.3
                }
            ],
        },
        options: {
            ...commonOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value: any) {
                            return '$' + value
                        }
                    }
                }
            }
        }
    },
    popularItems: {
        data: {
            labels: props.popularItems.map(item => item.name),
            datasets: [{
                label: 'Quantity Sold',
                data: props.popularItems.map(item => item.totalQuantity),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ]
            }]
        },
        options: commonOptions
    },
    // orderTypes: {
    //     data: {
    //         labels: props.orderTypes?.map(type => {
    //             const typeMap: Record<string, string> = {
    //                 'dine_in': 'Dine In',
    //                 'delivery': 'Delivery',
    //                 'takeaway': 'Takeaway'
    //             }
    //             return typeMap[type.type] || type.type
    //         }) || [],
    //         datasets: [{
    //             label: 'Order Distribution',
    //             data: props.orderTypes?.map(type => type.count) || [],
    //             backgroundColor: [
    //                 'rgba(54, 162, 235, 0.7)',
    //                 'rgba(255, 99, 132, 0.7)',
    //                 'rgba(255, 206, 86, 0.7)'
    //             ],
    //             borderWidth: 1
    //         }]
    //     },
    //     options: {
    //         ...commonOptions,
    //         plugins: {
    //             tooltip: {
    //                 callbacks: {
    //                     label: function (context: any) {
    //                         const label = context.label || ''
    //                         const value = context.raw || 0
    //                         const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
    //                         const percentage = Math.round((value / total) * 100)
    //                         return `${label}: ${value} (${percentage}%)`
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // },
    // salesByCategory: {
    //     data: {
    //         // This would come from your API - example data structure
    //         labels: ['Meals', 'Drinks', 'Sides', 'Desserts'],
    //         datasets: [{
    //             label: 'Sales by Category',
    //             data: [1200, 800, 400, 300], // Example data
    //             backgroundColor: [
    //                 'rgba(75, 192, 192, 0.7)',
    //                 'rgba(153, 102, 255, 0.7)',
    //                 'rgba(255, 159, 64, 0.7)',
    //                 'rgba(201, 203, 207, 0.7)'
    //             ],
    //             borderWidth: 1
    //         }]
    //     },
    //     options: {
    //         ...commonOptions,
    //         scales: {
    //             y: {
    //                 beginAtZero: true,
    //                 ticks: {
    //                     callback: function (value: any) {
    //                         return '$' + value
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
}))
</script>

<template>
    <div class="bg-white p-6 rounded-lg shadow mb-6">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
            <Icon name="mdi:chart-areaspline" class="text-blue-500" />
            Performance Analytics
        </h2>

        <CommonLoader v-if="loading" class="min-h-[400px]" />

        <div v-else class="space-y-8">
            <!-- Top Row: Revenue and Order Distribution -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Revenue Trend -->
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon name="mdi:trending-up" class="text-green-500" />
                        Revenue Trend
                    </h3>
                    <div class="h-[300px]">
                        <Line :data="charts.revenue.data" :options="charts.revenue.options" />
                    </div>
                </div>

                <!-- Order Type Distribution -->
                <!-- <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon name="mdi:chart-pie" class="text-purple-500" />
                        Order Distribution
                    </h3>
                    <div class="h-[300px]">
                        <Pie :data="charts.orderTypes.data" :options="charts.orderTypes.options" />
                    </div>
                </div> -->
            </div>

            <!-- Bottom Row: Popular Items and Sales by Category -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Popular Items -->
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon name="mdi:food" class="text-amber-500" />
                        Popular Items
                    </h3>
                    <div class="h-[300px]">
                        <Bar :data="charts.popularItems.data" :options="charts.popularItems.options" />
                    </div>
                </div>

                <!-- Sales by Category -->
                <!-- <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon name="mdi:shape" class="text-blue-500" />
                        Sales by Category
                    </h3>
                    <div class="h-[300px]">
                        <Bar :data="charts.salesByCategory.data" :options="charts.salesByCategory.options" />
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Ensure charts maintain proper aspect ratio */
.chart-container {
    position: relative;
    height: 100%;
    min-height: 300px;
}
</style>