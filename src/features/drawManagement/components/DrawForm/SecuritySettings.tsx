import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';

import { TextField, Typography } from '../../../../components/ui';

const SecuritySettings = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Security Settings
      </Typography>
      
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ maxWidth: 500 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>RNG Method</InputLabel>
          <Select
            name="security.rngMethod"
            label="RNG Method"
          >
            <MenuItem value="algorithm">Algorithm</MenuItem>
            <MenuItem value="physical">Physical Draw</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="security.requiredApprovals"
          label="Required Approvals"
          type="number"
          fullWidth
          sx={{ mb: 3 }}
          inputProps={{ min: 1, max: 5 }}
        />

        <Typography variant="body2" color="text.secondary">
          Note: All draw modifications will be logged for audit purposes.
        </Typography>
      </Box>
    </Box>
  );
};

export default SecuritySettings;