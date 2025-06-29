import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
import { 
  MoreVert, 
  Edit, 
  Cancel, 
  CheckCircle, 
  Visibility,
  Delete 
} from '@mui/icons-material';
import type { Draw } from '../../types/drawTypes';
import { useDrawPermissions } from '../../../../hooks/useDrawPermissions';
import ConfirmationDialog from './ConfirmationDialog';
import DrawForm from '../DrawForm/DrawForm';
import ResultEntryForm from '../DrawDetail/ResultEntryForm';
import DrawDetail from '../DrawDetail/DrawDetail';

interface ActionMenuProps {
  draw: Draw;
}

const ActionMenu = ({ draw }: ActionMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openResults, setOpenResults] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  
  const permissions = useDrawPermissions(draw);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const menuItems = [
    { 
      label: 'View Details', 
      icon: <Visibility fontSize="small" />, 
      action: () => setOpenDetail(true),
      show: true
    },
    { 
      label: 'Edit', 
      icon: <Edit fontSize="small" />, 
      action: () => setOpenEdit(true),
      show: permissions.canEdit
    },
    { 
      label: 'Post Results', 
      icon: <CheckCircle fontSize="small" />, 
      action: () => setOpenResults(true),
      show: permissions.canPostResults
    },
    { 
      label: 'Cancel Draw', 
      icon: <Cancel fontSize="small" />, 
      action: () => setOpenCancel(true),
      show: permissions.canCancel
    },
    { 
      label: 'Delete', 
      icon: <Delete fontSize="small" />, 
      action: () => setOpenDelete(true),
      show: permissions.canDelete
    }
  ];

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVert />
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems.map((item, index) => item.show && (
          <MenuItem key={index} onClick={() => { item.action(); handleClose(); }}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
      
      {openEdit && (
        <DrawForm 
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          draw={draw}
        />
      )}
      
      {openDetail && (
        <DrawDetail 
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          drawId={draw.id}
        />
      )}
      
      {openResults && (
        <ResultEntryForm 
          open={openResults}
          onClose={() => setOpenResults(false)}
          draw={draw}
        />
      )}
      
      <ConfirmationDialog
        open={openCancel}
        title="Cancel Draw"
        message={`Are you sure you want to cancel "${draw.name}"?`}
        onConfirm={() => {/* Cancel draw mutation */}}
        onClose={() => setOpenCancel(false)}
      />
      
      <ConfirmationDialog
        open={openDelete}
        title="Delete Draw"
        message={`Permanently delete "${draw.name}"? This cannot be undone.`}
        onConfirm={() => {/* Delete draw mutation */}}
        onClose={() => setOpenDelete(false)}
      />
    </>
  );
};

export default ActionMenu;