import { DataGrid, type DataGridProps } from '@mui/x-data-grid';
import { useTheme } from '@mui/material';


export const CustomDataGrid = (props: DataGridProps) => {
  const theme = useTheme();
  
  return (
    <DataGrid
      disableRowSelectionOnClick
      sx={{
        '& .MuiDataGrid-row': {
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        },
        '& .MuiDataGrid-cell:focus': {
          outline: 'none'
        },
        '& .MuiDataGrid-virtualScroller': {
          overflowX: 'auto'
        },
        ...props.sx
      }}
      {...props}
    />
  );
};