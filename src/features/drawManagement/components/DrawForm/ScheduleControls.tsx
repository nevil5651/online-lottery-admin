import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid
} from '@mui/material';
import { TextField, Typography } from '../../../../components/ui';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useField } from 'formik';

const ScheduleControls = () => {
  const [scheduleField, , scheduleHelpers] = useField('schedule');
  const [isRecurringField] = useField('schedule.isRecurring');

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Schedule Configuration
      </Typography>
      
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <DateTimePicker
            label="Start Date & Time"
            value={scheduleField.value.startDate}
            onChange={(date) => scheduleHelpers.setValue({
              ...scheduleField.value,
              startDate: date
            })}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <DateTimePicker
            label="End Date & Time"
            value={scheduleField.value.endDate}
            onChange={(date) => scheduleHelpers.setValue({
              ...scheduleField.value,
              endDate: date
            })}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <DateTimePicker
            label="Draw Time"
            value={scheduleField.value.drawTime}
            onChange={(date) => scheduleHelpers.setValue({
              ...scheduleField.value,
              drawTime: date
            })}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            name="schedule.cutoffMinutes"
            label="Cutoff Minutes Before Draw"
            type="number"
            fullWidth
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox name="schedule.isRecurring" />}
            label="Recurring Draw"
          />
          
          {isRecurringField.value && (
            <TextField
              name="schedule.recurrenceRule"
              label="Recurrence Rule (Cron)"
              fullWidth
              sx={{ mt: 2 }}
              placeholder="0 10 * * * (Daily at 10:00 AM)"
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScheduleControls;