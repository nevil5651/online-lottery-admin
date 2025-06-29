import { useMemo } from 'react';
import { 
  DataGrid, 
  type GridColDef, 
  type GridPaginationModel,
  type GridRenderCellParams 
} from '@mui/x-data-grid';
import { Box } from '@mui/material';
import type { Draw } from '../../types/drawTypes';
import StatusIndicator from '../common/StatusIndicator';
import ActionMenu from '../common/ActionMenu';
import { formatDateTime } from '../../../../utils/timeUtils';
import {StatusChip} from '../../../../components/ui';
import ResultActionsCell from './ResultActionsCell';

interface DrawTableProps {
  draws: Draw[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

const DrawTable = ({ 
  draws, 
  total, 
  page, 
  pageSize, 
  loading, 
  onPageChange,
  onPageSizeChange 
}: DrawTableProps) => {
  
  const columns: GridColDef[] = useMemo(() => [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 100 
    },
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1 
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 120 
    },
    { 
      field: 'ticketPrice', 
      headerName: 'Ticket Price', 
      width: 120,
      valueFormatter: (params: { value: number }) => `₹${params.value.toFixed(2)}`
    },
    { 
      field: 'schedule.drawTime', 
      headerName: 'Draw Time', 
      width: 180,
      valueGetter: (params: GridRenderCellParams<any, Draw>) => params.row.schedule.drawTime,
      valueFormatter: (params: { value: any }) => formatDateTime(params.value)
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params: GridRenderCellParams<Draw>) => (
        <StatusIndicator status={params.value} />
      )
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Draw>) => (
        <ActionMenu draw={params.row} />
      )
    },
    { 
    field: 'resultStatus',
    headerName: 'Result Status',
    width: 150,
    renderCell: (params) => (
      <StatusChip status={params.value || 'pending'} />
    )
  },
  {
    field: 'resultActions',
    headerName: 'Actions',
    width: 120,
    renderCell: (params) => (
      <ResultActionsCell draw={params.row} />
    )
  }
  ], []);

  const paginationModel = {
    page,
    pageSize,
  };

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    onPageChange(model.page);
    onPageSizeChange(model.pageSize);
  };

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={draws}
        columns={columns}
        rowCount={total}
        loading={loading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default DrawTable;