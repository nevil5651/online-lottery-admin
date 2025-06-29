import type { Draw, DrawFilters } from '../types/drawTypes';
import { apiClient } from '../../../lib/axios';

export const fetchDraws = async (filters: DrawFilters, page: number, pageSize: number) => {
  const params = {
    ...filters,
    page,
    limit: pageSize,
    startDate: filters.startDate?.toISOString(),
    endDate: filters.endDate?.toISOString(),
  };
  
  const response = await apiClient.get('/draws', { params });
  return response.data;
};

export const fetchDrawById = async (id: string) => {
  const response = await apiClient.get(`/draws/${id}`);
  return response.data;
};

export const createDraw = async (drawData: Partial<Draw>) => {
  const response = await apiClient.post('/draws', drawData);
  return response.data;
};

export const updateDraw = async (id: string, drawData: Partial<Draw>) => {
  const response = await apiClient.patch(`/draws/${id}`, drawData);
  return response.data;
};

export const cancelDraw = async (id: string) => {
  const response = await apiClient.patch(`/draws/${id}/status`, { status: 'cancelled' });
  return response.data;
};

export const postResults = async (id: string, winningNumbers: number[]) => {
  const response = await apiClient.post(`/draws/${id}/result`, { winningNumbers });
  return response.data;
};