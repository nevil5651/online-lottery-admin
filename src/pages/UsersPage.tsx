import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PermissionProvider } from '../features/users/UserPermission';
import UserManagement from '../features/users/UserManagement';
import { queryClient } from '../features/users/queryClient';

// Sample permission logic - customize based on your auth system
const checkPermission = (action: string, resource: string): boolean => {
  // Example: Get user roles from auth context
  const userRoles = ['admin']; // Replace with actual user roles
  
  if (userRoles.includes('super-admin')) return true;
  
  // Define permission rules
  const permissions: Record<string, string[]> = {
    update: ['admin', 'support'],
    delete: ['admin'],
    reset_password: ['admin', 'support'],
  };
  
  return permissions[action]?.some(role => userRoles.includes(role)) || false;
};

const UsersPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PermissionProvider permissions={checkPermission}>
        <UserManagement />
      </PermissionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default UsersPage;

