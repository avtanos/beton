export enum UserRole {
  OPERATOR = 'operator',
  TECHNOLOGIST = 'technologist',
  SHIFT_MASTER = 'shift_master',
  LABORATORY = 'laboratory',
  PRODUCTION_HEAD = 'production_head',
  LOGISTICS = 'logistics',
  ADMIN = 'admin',
}

export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum BatchStatus {
  PLANNED = 'planned',
  DOSING = 'dosing',
  MIXING = 'mixing',
  DISCHARGING = 'discharging',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export enum QualityStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface User {
  id: number
  username: string
  email?: string
  full_name?: string
  role: UserRole
  is_active: boolean
  created_at: string
}

export interface Recipe {
  id: number
  name: string
  code: string
  description?: string
  cement_kg: number
  sand_kg: number
  gravel_kg: number
  water_kg: number
  additive1_kg: number
  additive2_kg: number
  mixing_time_sec: number
  discharge_time_sec: number
  is_gost: boolean
  version: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: number
  order_number: string
  concrete_grade: string
  volume_m3: number
  planned_time?: string
  status: OrderStatus
  recipe_id: number
  customer_name?: string
  delivery_address?: string
  vehicle_number?: string
  created_at: string
  completed_at?: string
}

export interface Batch {
  id: number
  batch_number: string
  order_id: number
  recipe_id: number
  volume_m3: number
  status: BatchStatus
  actual_cement_kg?: number
  actual_sand_kg?: number
  actual_gravel_kg?: number
  actual_water_kg?: number
  deviation_cement_pct?: number
  deviation_sand_pct?: number
  deviation_gravel_pct?: number
  deviation_water_pct?: number
  started_at?: string
  completed_at?: string
  created_at: string
}

export interface QualityCheck {
  id: number
  batch_id: number
  mobility_cm?: number
  strength_mpa?: number
  moisture_pct?: number
  deviations?: string
  status: QualityStatus
  checked_at: string
}

export interface WarehouseMaterial {
  id: number
  material_type: string
  material_name: string
  storage_location?: string
  current_stock_kg: number
  min_stock_kg: number
  max_stock_kg?: number
  moisture_pct: number
  last_updated: string
}

export interface EquipmentStatus {
  id: number
  equipment_name: string
  equipment_type: string
  is_operational: boolean
  status: string
  last_update: string
  error_message?: string
}

export interface MonitoringDashboard {
  active_batches: number
  pending_orders: number
  equipment_status: EquipmentStatus[]
  recent_batches: Batch[]
  low_stock_materials: WarehouseMaterial[]
}

