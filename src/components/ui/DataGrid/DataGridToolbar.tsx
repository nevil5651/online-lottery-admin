import { GridToolbarContainer, GridToolbarFilterButton, 
  GridToolbarExport, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { SecondaryButton } from '../Buttons/SecondaryButton';
import { Block, Delete, LockReset } from '@mui/icons-material';


interface DataGridToolbarProps {
  selectedId: any;
  can: (action: string, resource: string) => boolean;
  onBatchAction: (action: string) => void;
}

export const DataGridToolbar = ({ 
  selectedId, 
  can, 
  onBatchAction 
}: DataGridToolbarProps) => (
  <GridToolbarContainer sx={{ p: 1, gap: 1, flexWrap: 'wrap' }}>
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector  />
      <GridToolbarExport />
    </Box>
    
    {selectedId !== null && (
      <Box sx={{ ml: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {can('update_status', 'user') && (
          <SecondaryButton
            startIcon={<Block />}
            onClick={() => onBatchAction('suspend')}
            color="error"
          >
            Suspend
          </SecondaryButton>
        )}
        {can('reset_password', 'user') && (
          <SecondaryButton
            startIcon={<LockReset />}
            onClick={() => onBatchAction('reset_password')}
          >
            Reset
          </SecondaryButton>
        )}
        {can('delete', 'user') && (
          <SecondaryButton
            startIcon={<Delete />}
            onClick={() => onBatchAction('delete')}
            color="error"
          >
            Delete
          </SecondaryButton>
        )}
      </Box>
    )}
  </GridToolbarContainer>
);