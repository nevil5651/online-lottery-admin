import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid
} from '@mui/material';
import { TextField, Typography } from '../../../../components/ui';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useField } from 'formik';
import dayjs, { Dayjs } from 'dayjs';

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
            value={scheduleField.value.startDate ? dayjs(scheduleField.value.startDate) : null}
            onChange={(date: Dayjs | null) => scheduleHelpers.setValue({
              ...scheduleField.value,
              startDate: date ? date.toISOString() : null
            })}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <DateTimePicker
            value={scheduleField.value.endDate ? dayjs(scheduleField.value.endDate) : null}
            onChange={(date: Dayjs | null) => scheduleHelpers.setValue({
              ...scheduleField.value,
              endDate: date ? date.toISOString() : null
            })}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <DateTimePicker
            value={scheduleField.value.drawTime ? dayjs(scheduleField.value.drawTime) : null}
            onChange={(date: Dayjs | null) => scheduleHelpers.setValue({
              ...scheduleField.value,
              drawTime: date ? date.toISOString() : null
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