import type { OrderItemObject, OrderObject, OrderTypes } from './order.type'


interface RevenueDataPointDto {
    date: string
    orders: number
    revenue: number
}

export interface RevenueAnalyticsDto {
    data: RevenueDataPointDto[] // e.g., [100, 200, 150]
    labels: string[] // e.g., ['Mon', 'Tue', 'Wed']
    summary: {
        totalRevenue: number
        averageDaily: number
        totalOrders: number
    }
}

export interface PopularItemDto {
    menuItemId: string,
    name: string,
    category: string,
    totalQuantity: number,
    totalRevenue: number,
    averagePrice: number,
    lastSoldAt: string | Date,
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
