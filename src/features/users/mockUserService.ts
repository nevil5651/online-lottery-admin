import type { User, PaginatedResponse, ListUsersParams, UserStatus, UserRole } from './UserTypes';

// Generate mock users
const generateMockUsers = (count: number): User[] => {
  const statuses: UserStatus[] = ['active', 'suspended', 'pending_kyc', 'banned'];
  const roles: UserRole[] = ['player', 'agent', 'super-admin', 'auditor', 'support'];
  const users: User[] = [];
  
  for (let i = 1; i <= count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const roleCount = Math.min(Math.floor(Math.random() * 3) + 1, roles.length);
    const userRoles: UserRole[] = [];
    
    // Ensure at least one role
    userRoles.push(roles[Math.floor(Math.random() * roles.length)]);
    
    // Add additional random roles
    while (userRoles.length < roleCount) {
      const newRole = roles[Math.floor(Math.random() * roles.length)];
      if (!userRoles.includes(newRole)) {
        userRoles.push(newRole);
      }
    }
    
    users.push({
      id: `user-${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      mobile: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      avatarUrl: `https://i.pravatar.cc/150?img=${i % 70}`,
      status,
      roles: userRoles,
      lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
      kycDocuments: Math.random() > 0.7 ? ['id_proof.pdf', 'address_proof.pdf'] : undefined
    });
  }
  
  return users;
};

// Generate 150 mock users
const mockUsers = generateMockUsers(150);

// Mock service implementation
export const mockUserService = {
  listUsers: async (params: ListUsersParams): Promise<PaginatedResponse<User>> => {
    const { page = 1, pageSize = 10, search, status, role, sortBy, sortOrder } = params;
    
    // Filter users
    let filteredUsers = [...mockUsers];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        u.name.toLowerCase().includes(searchLower) || 
        u.email.toLowerCase().includes(searchLower) ||
        u.mobile.includes(search)
      );
    }
    
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.status === status);
    }
    
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.roles.includes(role));
    }
    
    // Sort users
    if (sortBy) {
      filteredUsers.sort((a, b) => {
        const aValue = a[sortBy as keyof User];
        const bValue = b[sortBy as keyof User];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        if (aValue instanceof Date && bValue instanceof Date) {
          return sortOrder === 'asc' 
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }
        
        return 0;
      });
    }
    
    // Paginate
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return {
      items: paginatedUsers,
      total: filteredUsers.length,
      page,
      pageSize
    };
  },
  
  getUser: async (id: string): Promise<User | undefined> => {
    return mockUsers.find(u => u.id === id);
  },
  
  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) throw new Error('User not found');
    
    const updatedUser = { ...mockUsers[userIndex], ...updates };
    mockUsers[userIndex] = updatedUser;
    return updatedUser;
  },
  
  resetPassword: async (id: string, method: string): Promise<void> => {
    // Simulate password reset
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  
  toggleBlock: async (id: string, blocked: boolean): Promise<void> => {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) throw new Error('User not found');
    
    mockUsers[userIndex].status = blocked ? 'suspended' : 'active';
    await new Promise(resolve => setTimeout(resolve, 300));
  },
  
  deleteUser: async (id: string): Promise<void> => {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) throw new Error('User not found');
    
    mockUsers.splice(userIndex, 1);
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};