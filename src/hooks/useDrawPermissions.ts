import { useUser } from '../contexts/UserContext';
import type { Draw } from '../features/drawManagement/types/drawTypes';

export const useDrawPermissions = (draw?: Draw) => {
  const { role } = useUser();
  
  const canEdit = () => {
    if (!draw) return false;
    return ['admin', 'super-admin'].includes(role) && 
           ['scheduled', 'open'].includes(draw.status);
  };
  
  const canCancel = () => {
    if (!draw) return false;
    return role === 'super-admin' && 
           ['scheduled', 'open'].includes(draw.status);
  };
  
  const canPostResults = () => {
    if (!draw) return false;
    return ['admin', 'super-admin'].includes(role) && 
           draw.status === 'closed' && 
           !draw.winningNumbers;
  };
  
  const canDelete = () => {
    if (!draw) return false;
    return role === 'super-admin' && 
           ['scheduled', 'cancelled'].includes(draw.status);
  };
  
  return {
    canEdit: canEdit(),
    canCancel: canCancel(),
    canPostResults: canPostResults(),
    canDelete: canDelete(),
  };
};