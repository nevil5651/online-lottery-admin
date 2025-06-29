import type { User, PaginatedResponse, ListUsersParams } from './UserTypes';
import { mockUserService } from './mockUserService';

// Convert ListUsersParams to match mock service expectations
const mapListParams = (params: {
  page: number;
  perPage: number;
  filter: {
    search?: string;
    roles?: string[];
    status?: string;
  };
  sort?: any;
}): ListUsersParams => ({
  page: params.page + 1, // Our mock uses 1-based index
  pageSize: params.perPage,
  search: params.filter.search,
  status: params.filter.status as any,
  role: params.filter.roles?.[0] as any,
  sortBy: params.sort?.field,
  sortOrder: params.sort?.sort
});

export const fetchUsers = async (params: {
  page: number;
  perPage: number;
  filter: {
    search?: string;
    roles?: string[];
    status?: string;
  };
  sort?: any;
}): Promise<{ data: User[]; pagination: PaginatedResponse<User> }> => {
  const response = await mockUserService.listUsers(mapListParams(params));
  return {
    data: response.items,
    pagination: response
  };
};

export const fetchUser = async (id: string): Promise<User> => {
  const user = await mockUserService.getUser(id);
  if (!user) throw new Error('User not found');
  return user;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  return mockUserService.updateUser(id, userData);
};

export const resetPassword = async (id: string): Promise<void> => {
  return mockUserService.resetPassword(id, 'POST');
};

export const toggleBlockUser = async (id: string, blocked: boolean): Promise<void> => {
  return mockUserService.toggleBlock(id, blocked);
};

export const deleteUser = async (id: string): Promise<void> => {
  return mockUserService.deleteUser(id);
};