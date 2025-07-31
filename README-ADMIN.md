# Admin Panel Setup and Usage

## Overview

The admin panel provides comprehensive system administration capabilities for the Oracle AI Migration application. It includes user management, system monitoring, activity logging, and configuration management.

## Features

### 1. Overview Dashboard
- Real-time system statistics
- User activity metrics
- Migration success rates
- System health indicators

### 2. User Management
- View all registered users
- Update user roles (user, moderator, admin)
- Delete user accounts
- Monitor user activity

### 3. System Settings
- Configure AI models
- Set file size limits
- Toggle cache settings
- Enable/disable maintenance mode

### 4. Activity Logs
- Track all administrative actions
- Monitor system events
- Audit trail for compliance

### 5. System Monitoring
- Real-time performance metrics
- CPU, memory, and disk usage
- Application-specific metrics
- Queue monitoring

## Setup Instructions

### 1. Database Migration

First, run the admin migration to add the necessary tables and roles:

```bash
# Apply the migration
supabase db push
```

### 2. Set Up First Admin User

Use the provided script to set up your first admin user:

```bash
# Install dependencies if not already installed
npm install @supabase/supabase-js

# Set your Supabase credentials
export SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Make a user admin (replace with actual email)
node scripts/setup-admin.js user@example.com
```

### 3. Access the Admin Panel

Once set up, admins can access the panel at:
- URL: `/admin`
- Accessible from the user dropdown menu (Shield icon)

## User Roles

### Admin
- Full system access
- User management
- System configuration
- Activity monitoring

### Moderator
- Limited admin access
- User management (no deletion)
- View activity logs
- Basic system monitoring

### User
- Standard application access
- No admin capabilities

## Security Features

- Role-based access control (RBAC)
- Row-level security (RLS) policies
- Activity logging for all admin actions
- Secure API endpoints

## API Endpoints

The admin panel uses the following Supabase tables:
- `profiles` - User information and roles
- `admin_logs` - Activity logging
- `system_settings` - Configuration management
- `migrations` - Migration tracking
- `migration_files` - File conversion tracking

## Monitoring and Alerts

The admin panel provides real-time monitoring for:
- System resource usage
- Active conversions
- Queue lengths
- Cache performance
- Response times

## Troubleshooting

### Common Issues

1. **Admin panel not accessible**
   - Ensure user has admin/moderator role
   - Check database migration was applied
   - Verify RLS policies are in place

2. **Stats not loading**
   - Check Supabase connection
   - Verify table permissions
   - Review browser console for errors

3. **User role updates failing**
   - Ensure service role key has proper permissions
   - Check RLS policies allow admin operations

### Support

For additional support:
1. Check the application logs
2. Review Supabase dashboard for errors
3. Verify database schema matches migrations

## Development

### Adding New Admin Features

1. Update types in `src/types/admin.ts`
2. Add functionality to `src/hooks/useAdmin.tsx`
3. Create UI components as needed
4. Update the admin panel page
5. Add appropriate RLS policies

### Testing Admin Features

1. Set up test admin user
2. Test role-based access
3. Verify activity logging
4. Check RLS policy enforcement 