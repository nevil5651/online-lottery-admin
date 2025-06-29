import React, { useState } from 'react';
import { 
  DataGrid, 
  type GridColDef, 
  type GridPaginationModel,
  type GridSortModel 
} from '@mui/x-data-grid';
//import type { Transaction } from '../types/financeTypes';
import { useTransactions } from '../hooks/useTransactions';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'createdAt', headerName: 'Date', width: 180, 
    valueFormatter: (params: { value: any }) => new Date(params.value).toLocaleString() },
  { field: 'username', headerName: 'User', width: 150 },
  { field: 'type', headerName: 'Type', width: 120 },
  { field: 'amount', headerName: 'Amount', width: 120, 
    valueFormatter: (params: { value: number }) => `$${params.value.toFixed(2)}` },
  { field: 'status', headerName: 'Status', width: 120,
    cellClassName: (params) => `status-${params.value.toLowerCase()}` },
  { field: 'referenceId', headerName: 'Reference', width: 200 },
];



interface TransactionTableProps {
  userId?: string;
  statusFilter?: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({  }) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'createdAt', sort: 'desc' },
  ]);
  
  const { data, isLoading } = useTransactions({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    sort: sortModel[0]?.field,
    order: sortModel[0]?.sort as 'asc' | 'desc',
  });

  const transactions = data?.transactions ?? [];
  const total = data?.total ?? 0;

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={transactions}
        columns={columns}
        loading={isLoading}
        rowCount={total}
        paginationMode="server"
        sortingMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default TransactionTable;