import  { useState } from 'react';
import { Box,Container, Paper } from '@mui/material';
import {Button,Typography} from '../../../../components/ui';
import { useQueryClient } from '@tanstack/react-query';
import DrawTable from './DrawTable';
import DrawFiltersComponent  from './DrawFilters';
import type { DrawFilters } from '../../types/drawTypes';
import { useDraws } from '../../apis/drawQueries';
import { useUser } from '../../../../contexts/UserContext';
import DrawForm from '../DrawForm/DrawForm';
import { useSnackbar } from 'notistack';
import { ResultUpdateContext } from '../../../../contexts/ResultUpdateContext';

const DrawList = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<DrawFilters>({});
  const [openCreate, setOpenCreate] = useState(false);
  
  const { role } = useUser();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  type DrawsResponse = {
    draws: any[]; // Replace 'any' with your actual Draw type if available
    total: number;
  };
  
  const { data, isLoading } = useDraws(filters, page + 1, pageSize) as { data: DrawsResponse | undefined, isLoading: boolean };
  
  const handleFiltersChange = (newFilters: DrawFilters) => {
    setFilters(newFilters);
    setPage(0);
  };
  
  const handleCreateSuccess = () => {
    setOpenCreate(false);
    queryClient.invalidateQueries({ queryKey: ['draws'] });
  };

   const handleResultUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['draws'] });
    enqueueSnackbar('Results updated successfully', { variant: 'success' });
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        {/* <Typography variant="h4" gutterBottom>
          Draw Management
        </Typography> */}
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            {['admin', 'super-admin'].includes(role) && (
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => setOpenCreate(true)}
              >
                New Draw
              </Button>
            )}
          </Box>
          <DrawFiltersComponent  onFilterChange={handleFiltersChange} />
        </Paper>

        <ResultUpdateContext.Provider value={{ onResultUpdate: handleResultUpdate }}>
        
        <DrawTable 
          draws={data?.draws || []} 
          total={data?.total || 0}
          page={page}
          pageSize={pageSize}
          loading={isLoading}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
        </ResultUpdateContext.Provider>
      </Box>
      
      <DrawForm 
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={handleCreateSuccess}
      />
    </Container>
  );
};

export default DrawList;