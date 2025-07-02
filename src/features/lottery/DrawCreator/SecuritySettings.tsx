import { 
  Box,  
  FormControlLabel, 
  Switch, 
  Grid,
  Alert
} from '@mui/material';
import { TextField,Typography,Card } from '../../../components/ui';
import type { DrawSecurity } from '../types';

interface SecuritySettingsProps {
  security: DrawSecurity;
  onChange: (security: DrawSecurity) => void;
  errors?: Record<string, string>;
}

export const SecuritySettings = ({ 
  security, 
  onChange,
  errors 
}: SecuritySettingsProps) => {
  const handleChange = (field: keyof DrawSecurity, value: any) => {
    onChange({ ...security, [field]: value });
  };

  return (
    <Box>
      <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Security & Validation
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="RNG Method"
            value={security.rngMethod}
            onChange={(e) => handleChange('rngMethod', e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="algorithm">Algorithmic (SHA-256)</option>
            <option value="physical">Physical Draw Mechanism</option>
          </TextField>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {security.rngMethod === 'algorithm' 
              ? 'Cryptographically secure random number generation' 
              : 'Requires physical device integration'}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Required Approvals"
            value={security.requiredApprovals}
            onChange={(e) => handleChange('requiredApprovals', Number(e.target.value))}
            inputProps={{ min: 1, max: 5 }}
            error={!!errors?.requiredApprovals}
            helperText={errors?.requiredApprovals || "Number of admins needed to verify results"}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={security.auditTrail}
                onChange={(e) => handleChange('auditTrail', e.target.checked)}
              />
            }
            label="Enable Full Audit Trail"
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Records all actions related to this draw with timestamps and admin IDs
          </Typography>
        </Grid>

        {security.auditTrail && (
          <Grid item xs={12}>
            <Alert severity="info">
              Audit trail will include: Draw creation, modifications, result generation, 
              and winner verification actions. All entries are cryptographically signed.
            </Alert>
          </Grid>
        )}
      </Grid>
      </Card>
    </Box>
  );
};