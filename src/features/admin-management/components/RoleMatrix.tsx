// RoleMatrix.tsx
import React from 'react';
import { 
  Dialog, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import 
 { DialogTitle, 
  DialogContent } from '../../../components/ui';
import { rolePermissions } from '../../../auth/roles';
import type { Role, Permission } from '../../../auth/roles';

interface RoleMatrixProps {
  open: boolean;
  onClose: () => void;
}

const permissionLabels: Record<Permission, string> = {
  USER_READ: 'View Users',
  USER_WRITE: 'Manage Users',
  DRAW_READ: 'View Draws',
  DRAW_WRITE: 'Manage Draws',
  RESULT_PUBLISH: 'Publish Results',
  FINANCE_READ: 'View Financials',
  FINANCE_WRITE: 'Manage Financials',
  SUPPORT_HANDLE: 'Handle Support',
  SETTINGS_WRITE: 'Modify Settings',
  AUDIT_VIEW: 'View Audit Logs',
  ADMIN_MANAGE: 'Manage Admins'
};

export const RoleMatrix: React.FC<RoleMatrixProps> = ({ open, onClose }) => {
  const roles = Object.keys(rolePermissions) as Role[];
  const permissions = Object.keys(permissionLabels) as Permission[];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Role-Permission Matrix</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Permission</TableCell>
                {roles.map(role => (
                  <TableCell key={role} align="center">
                    {role}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map(permission => (
                <TableRow key={permission}>
                  <TableCell>{permissionLabels[permission]}</TableCell>
                  {roles.map(role => (
                    <TableCell key={`${role}-${permission}`} align="center">
                      {rolePermissions[role].includes(permission) ? '✓' : '✗'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};