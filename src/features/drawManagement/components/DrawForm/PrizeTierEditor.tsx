import {
  Box,
  Divider,
  IconButton,
  Grid,
  MenuItem,
} from '@mui/material';
import {
  Button,
  TextField,
  Typography} from '../../../../components/ui';  
import { Add, Delete } from '@mui/icons-material';
import { FieldArray, useFormikContext } from 'formik';
import type { PrizeTier } from '../../types/drawTypes';

const PrizeTierEditor = () => {
  const { values } = useFormikContext<{ prizes: PrizeTier[] }>();

  return (
    <FieldArray name="prizes">
      {({ push, remove }) => (
        <Box>
          <Typography variant="h6" gutterBottom>
            Prize Tiers
          </Typography>
          
          <Divider sx={{ mb: 3 }} />

          {values.prizes.map((_prize, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <TextField
                  name={`prizes.${index}.name`}
                  label="Tier Name"
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  name={`prizes.${index}.value`}
                  label="Value"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  name={`prizes.${index}.valueType`}
                  label="Type"
                  select
                  fullWidth
                >
                  <MenuItem value="fixed">Fixed</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  name={`prizes.${index}.winners`}
                  label="Winners"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => remove(index)}>
                  <Delete color="error" />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => push({
              name: '',
              value: 0,
              valueType: 'fixed',
              winners: 1
            })}
          >
            Add Prize Tier
          </Button>
        </Box>
      )}
    </FieldArray>
  );
};

export default PrizeTierEditor;