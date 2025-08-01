import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLog, SystemSetting, UserProfile, MigrationStats, SystemMetrics } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setIsAdmin(false);
        return;
      }

      const isAdminUser = profile?.role === 'admin' || profile?.role === 'moderator';
      setIsAdmin(isAdminUser);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const getUsers = async (): Promise<UserProfile[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
      return [];
    }

    return data || [];
  };

  const updateUserRole = async (userId: string, role: 'user' | 'admin' | 'moderator') => {
    // Get current user's profile to check their role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return false;
    }

    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Prevent users from changing their own role
    if (userId === user.id) {
      toast({
        title: "Error",
        description: "You cannot change your own role",
        variant: "destructive",
      });
      return false;
    }

    // Prevent moderators from changing admin roles
    if (currentUserProfile?.role === 'moderator') {
      const { data: targetUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (targetUserProfile?.role === 'admin') {
        toast({
          title: "Error",
          description: "Moderators cannot change admin roles",
          variant: "destructive",
        });
        return false;
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
      return false;
    }

    await logAdminAction('user_management', 'update_user_role', userId, { role });
    toast({
      title: "Success",
      description: "User role updated successfully",
    });
    return true;
  };

  const getSystemSettings = async (): Promise<SystemSetting[]> => {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('setting_key');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch system settings",
        variant: "destructive",
      });
      return [];
    }

    return data || [];
  };

  const updateSystemSetting = async (settingKey: string, settingValue: any) => {
    const { error } = await supabase
      .from('system_settings')
      .update({ 
        setting_value: settingValue,
        updated_at: new Date().toISOString()
      })
      .eq('setting_key', settingKey);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update system setting",
        variant: "destructive",
      });
      return false;
    }

    await logAdminAction('system_settings', 'update_setting', settingKey, { settingValue });
    toast({
      title: "Success",
      description: "System setting updated successfully",
    });
    return true;
  };

  const getAdminLogs = async (limit = 100): Promise<AdminLog[]> => {
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Admin logs error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin logs",
        variant: "destructive",
      });
      return [];
    }

    return data || [];
  };

  const logAdminAction = async (
    targetType: string,
    action: string,
    targetId?: string,
    details?: any
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('admin_logs')
      .insert({
        admin_id: user.id,
        action,
        target_type: targetType,
        target_id: targetId,
        details
      });
  };

  const getMigrationStats = async (): Promise<MigrationStats> => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total migrations
      const { count: totalMigrations } = await supabase
        .from('migrations')
        .select('*', { count: 'exact', head: true });

      // Get total files
      const { count: totalFiles } = await supabase
        .from('migration_files')
        .select('*', { count: 'exact', head: true });

      // Get successful conversions
      const { count: successfulConversions } = await supabase
        .from('migration_files')
        .select('*', { count: 'exact', head: true })
        .eq('conversion_status', 'success');

      // Get active users today (users who created migrations today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: activeUsersToday } = await supabase
        .from('migrations')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      return {
        total_users: totalUsers || 0,
        total_migrations: totalMigrations || 0,
        total_files: totalFiles || 0,
        successful_conversions: successfulConversions || 0,
        active_users_today: activeUsersToday || 0,
      };
    } catch (error) {
      console.error('Error fetching migration stats:', error);
      return {
        total_users: 0,
        total_migrations: 0,
        total_files: 0,
        successful_conversions: 0,
        active_users_today: 0,
      };
    }
  };

  const deleteUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
      return false;
    }

    await logAdminAction('user_management', 'delete_user', userId);
    toast({
      title: "Success",
      description: "User deleted successfully",
    });
    return true;
  };

  const getUserMigrations = async (userId: string) => {
    const { data, error } = await supabase
      .from('migrations')
      .select(`
        *,
        migration_files (
          id,
          file_name,
          file_path,
          file_type,
          conversion_status,
          error_message,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user migrations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user migrations",
        variant: "destructive",
      });
      return [];
    }

    return data || [];
  };

  const getUserPerformanceMetrics = async (userId: string) => {
    // Get user's migration statistics
    const { data: migrations } = await supabase
      .from('migrations')
      .select('id')
      .eq('user_id', userId);

    const { data: files } = await supabase
      .from('migration_files')
      .select('conversion_status, created_at, updated_at')
      .in('migration_id', migrations?.map(m => m.id) || []);

    if (!files || files.length === 0) {
      return {
        total_migrations: 0,
        total_files: 0,
        successful_conversions: 0,
        failed_conversions: 0,
        pending_conversions: 0,
        success_rate: 0,
        average_processing_time: 0,
        recent_activity: []
      };
    }

    const totalMigrations = migrations?.length || 0;
    const totalFiles = files.length;
    const successfulConversions = files.filter(f => f.conversion_status === 'success').length;
    const failedConversions = files.filter(f => f.conversion_status === 'failed').length;
    const pendingConversions = files.filter(f => f.conversion_status === 'pending').length;
    const successRate = totalFiles > 0 ? (successfulConversions / totalFiles) * 100 : 0;

    // Calculate average processing time for successful conversions
    const successfulFiles = files.filter(f => f.conversion_status === 'success');
    let totalProcessingTime = 0;
    successfulFiles.forEach(file => {
      const created = new Date(file.created_at);
      const updated = new Date(file.updated_at);
      totalProcessingTime += updated.getTime() - created.getTime();
    });
    const averageProcessingTime = successfulFiles.length > 0 
      ? totalProcessingTime / successfulFiles.length 
      : 0;

    // Get recent activity (last 10 files)
    const recentActivity = files
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map(file => ({
        status: file.conversion_status,
        date: file.created_at
      }));

    return {
      total_migrations: totalMigrations,
      total_files: totalFiles,
      successful_conversions: successfulConversions,
      failed_conversions: failedConversions,
      pending_conversions: pendingConversions,
      success_rate: Math.round(successRate),
      average_processing_time: Math.round(averageProcessingTime / 1000), // Convert to seconds
      recent_activity: recentActivity
    };
  };

  const getUserDetails = async (userId: string) => {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }

    const migrations = await getUserMigrations(userId);
    const performanceMetrics = await getUserPerformanceMetrics(userId);

    return {
      profile,
      migrations,
      performanceMetrics
    };
  };

  return {
    isAdmin,
    loading,
    getUsers,
    updateUserRole,
    deleteUser,
    getSystemSettings,
    updateSystemSetting,
    getAdminLogs,
    logAdminAction,
    getMigrationStats,
    getUserMigrations,
    getUserPerformanceMetrics,
    getUserDetails,
  };
}; 