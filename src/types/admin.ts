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
  total_users: number;
  total_migrations: number;
  total_files: number;
  successful_conversions: number;
  active_users_today: number;
}

export interface AdminAction {
  type: 'user_management' | 'system_settings' | 'migration_management' | 'system_monitoring';
  action: string;
  target_id?: string;
  details?: any;
} 