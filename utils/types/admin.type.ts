import type { OrderItemObject, OrderObject, OrderTypes } from './order.type'
import type { UserRole } from './user.type'

export enum AIInsightTypes {
    WARNING = 'warning',
    INFO = 'info',
    SUCCESS = 'success',
    ERROR = 'error',
}

export interface DashboardStatsDto {
    revenue: number
    ordersToday: number
    popularItem: string
    totalOrders: number
    averageOrderValue: number
    totalItems: number
}

export interface RevenueAnalyticsDto {
    labels: string[] // e.g., ['Mon', 'Tue', 'Wed']
    data: number[] // e.g., [100, 200, 150]
    summary: {
        totalRevenue: number
        averageDaily: number
        totalOrders: number
    }
}

export interface PopularItemDto {
    name: string
    quantity: number
    category: string
    isAvailable: boolean
}

export interface SalesAnalytics {
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    totalItems: number
}

export interface OrderTrend {
    date: string
    orders: number
    revenue: number
}

export interface TopSellingItem {
    menuItemId: string
    totalQuantity: number
    totalRevenue: number
    averagePrice: number
    lastSoldAt: Date
}

export interface CustomerOrderStats {
    totalOrders: number
    totalSpent: number
    averageOrderValue: number
}

// Types for MongoDB Schemas
export type OrderSchema = OrderObject & {
    _id: string
    __v: number
}

export type OrderItemSchema = OrderItemObject & {
    _id: string
}

// Types for AI Insights
export interface AIInsight {
    id: string
    message: string
    type: AIInsightTypes
    createdAt: Date
}

// Types for Admin Dashboard
export interface AdminDashboardData {
    stats: DashboardStatsDto
    revenue: RevenueAnalyticsDto
    popularItems: PopularItemDto[]
    aiInsights: AIInsight[]
}

// Types for Order Analytics
export interface OrderAnalytics {
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    totalItems: number
}

export interface OrdersByType {
    type: OrderTypes
    count: number
    revenue: number
    averageOrderValue: number
    itemsSold: number
}

export interface OrderTrends {
    date: string
    orders: number
    revenue: number
}

export enum ReportTypes {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
}

export interface Report {
    id: string
    type: ReportTypes
    data: any
    generatedAt: Date
}
