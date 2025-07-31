export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id?: string;
  details?: any;
  created_at: string;
}

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  created_at: string;
  updated_at: string;
}

export interface MigrationStats {
  total_migrations: number;
  total_files: number;
  successful_conversions: number;
  failed_conversions: number;
  pending_conversions: number;
  total_users: number;
  active_users_today: number;
  active_users_week: number;
  active_users_month: number;
}

export interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  active_conversions: number;
  queue_length: number;
  cache_hit_rate: number;
  average_response_time: number;
}

export interface AdminAction {
  type: 'user_management' | 'system_settings' | 'migration_management' | 'system_monitoring';
  action: string;
  target_id?: string;
  details?: any;
} 