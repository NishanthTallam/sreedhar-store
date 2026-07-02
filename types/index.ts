// types/index.ts
// Shared type definitions for the General Store app

// Re-export Prisma enums for use in components without importing from @prisma/client directly
export type {
  Role,
  OrderStatus,
  ReturnStatus,
  AddressType,
  BannerType,
  ReviewStatus,
  CouponType,
  NotificationCategory,
} from "@prisma/client";

// Navigation link type used by sidebars and headers
export interface NavLink {
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
}

// API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination params
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Paginated response
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationParams;
}
