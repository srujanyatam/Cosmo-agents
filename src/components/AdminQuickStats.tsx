import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Activity, AlertTriangle } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { MigrationStats, SystemMetrics } from '@/types/admin';

interface AdminQuickStatsProps {
  stats?: MigrationStats;
  metrics?: SystemMetrics;
}

const AdminQuickStats: React.FC<AdminQuickStatsProps> = ({ stats, metrics }) => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) return null;

  return (
    <div className="flex gap-2">
      <Card className="w-32">
        <CardHeader className="p-3">
          <CardTitle className="text-xs flex items-center gap-1">
            <Users className="h-3 w-3" />
            Users
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-lg font-bold">{stats?.total_users || 0}</div>
          <Badge variant="outline" className="text-xs">
            {stats?.active_users_today || 0} today
          </Badge>
        </CardContent>
      </Card>

      <Card className="w-32">
        <CardHeader className="p-3">
          <CardTitle className="text-xs flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Migrations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-lg font-bold">{stats?.total_migrations || 0}</div>
          <Badge variant="outline" className="text-xs">
            {stats?.total_files || 0} files
          </Badge>
        </CardContent>
      </Card>

      <Card className="w-32">
        <CardHeader className="p-3">
          <CardTitle className="text-xs flex items-center gap-1">
            <Activity className="h-3 w-3" />
            System
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-lg font-bold">
            {metrics?.cpu_usage ? Math.round(metrics.cpu_usage) : 0}%
          </div>
          <Badge 
            variant={metrics?.cpu_usage && metrics.cpu_usage > 80 ? "destructive" : "outline"} 
            className="text-xs"
          >
            CPU
          </Badge>
        </CardContent>
      </Card>

      {metrics?.active_conversions && metrics.active_conversions > 0 && (
        <Card className="w-32">
          <CardHeader className="p-3">
            <CardTitle className="text-xs flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-lg font-bold">{metrics.active_conversions}</div>
            <Badge variant="destructive" className="text-xs">
              conversions
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminQuickStats; 