import axios from 'axios';
import type { ListUsersParams, PaginatedResponse, User, UserStatus } from './UserTypes';

const API_URL = import.meta.env.VITE_API_URL;

export const userService = {
  fetchUsers: async (params: ListUsersParams): Promise<PaginatedResponse<User>> => {
    const response = await axios.get<PaginatedResponse<User>>(`${API_URL}/users`, { params });
    return response.data;
  },
  
  fetchUser: async (id: string): Promise<User> => {
    const response = await axios.get<User>(`${API_URL}/users/${id}`);
    return response.data;
  },
  
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await axios.put<User>(`${API_URL}/users/${id}`, data);
    return response.data;
  },

  changeStatus: (id: string, status: UserStatus, reason?: string) => {
    // Implement the API call to change user status
    // Example:
    return fetch(`/api/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason })
    }).then(res => {
      if (!res.ok) throw new Error('Failed to change status');
      return res.json();
    });
  },
  resetPassword: (id: string, method: 'email' | 'temporary') => {
    // Implement the API call for resetting password here
    // Example:
    // return api.post(`/users/${id}/reset-password`, { method });
    return Promise.resolve();
  }
  
  // Add other API methods
};