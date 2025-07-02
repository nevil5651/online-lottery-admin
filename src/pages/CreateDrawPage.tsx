// src/features/lottery/pages/CreateDrawPage.tsx
import { Box, Container, Typography } from '@mui/material';
import { DrawForm } from '../features/lottery/DrawCreator/DrawForm';

export const CreateDrawPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* <Typography variant="h4" component="h1" gutterBottom>
          Create New Draw
        </Typography> */}
        <DrawForm />
      </Box>
    </Container>
  );
};

export default CreateDrawPage;