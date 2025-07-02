import React from 'react';
import { 
  Box, 
  Grid, 
  FormControlLabel,
  Switch,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { Typography,TextField ,Card} from '../../../components/ui';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { DrawSchedule } from '../types';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface ScheduleControlsProps {
  schedule: DrawSchedule;
  onChange: (schedule: DrawSchedule) => void;
  errors?: Record<string, string>;
}

export const ScheduleControls = ({ 
  schedule, 
  onChange,
  errors 
}: ScheduleControlsProps) => {
  // Get current timezone (e.g., "Asia/Kolkata")
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const handleDateChange = (field: keyof DrawSchedule, value: Dayjs | null) => {
    if (!value) return;
    
    onChange({
      ...schedule,
      [field]: value.toDate()
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...schedule,
      [name]: Number(value)
    });
  };

  const handleAutoCutoffToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...schedule,
      autoCutoff: e.target.checked,
      // Reset cutoff if disabling auto mode
      cutoffMinutes: e.target.checked ? 30 : schedule.cutoffMinutes
    });
  };

  return (
    <Box>
      <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Schedule Configuration
      </Typography>
      
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Sales Start"
              value={dayjs(schedule.startDate)}
              onChange={(value) => handleDateChange('startDate', value)}
              minDate={dayjs().subtract(1, 'minute')}
              timezone={userTimezone}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors?.startDate,
                  helperText: errors?.startDate || "When ticket sales begin"
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Sales End"
              value={dayjs(schedule.endDate)}
              onChange={(value) => handleDateChange('endDate', value)}
              minDate={dayjs(schedule.startDate).add(1, 'minute')}
              timezone={userTimezone}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors?.endDate,
                  helperText: errors?.endDate || "When ticket sales stop"
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Draw Time"
              value={dayjs(schedule.drawTime)}
              onChange={(value) => handleDateChange('drawTime', value)}
              minDate={dayjs(schedule.endDate).add(1, 'minute')}
              timezone={userTimezone}
              slots={{
                openPickerIcon: AccessTimeIcon
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors?.drawTime,
                  helperText: errors?.drawTime || "Exact time of the draw"
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField             
              fullWidth
              label="Time Zone"
              value={userTimezone}
              disabled
              helperText="Automatically detected"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AccessTimeIcon />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value={userTimezone}>
                {userTimezone} (Current)
              </MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={schedule.autoCutoff}
                  onChange={handleAutoCutoffToggle}
                />
              }
              label="Automatic Sales Cutoff"
            />
            <Typography variant="body2" color="textSecondary">
              {schedule.autoCutoff 
                ? "Sales will automatically stop 30 minutes before draw time" 
                : "Set custom cutoff time below"}
            </Typography>
          </Grid>
          
          {!schedule.autoCutoff && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Cutoff Minutes"
                name="cutoffMinutes"
                value={schedule.cutoffMinutes}
                onChange={handleNumberChange}
                inputProps={{ min: 5, max: 1440 }}
                error={!!errors?.cutoffMinutes}
                helperText={errors?.cutoffMinutes || "Minutes before draw when sales stop"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">minutes</InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
          
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="On Conflict"
              value={schedule.conflictStrategy}
              onChange={(e) => onChange({
                ...schedule,
                conflictStrategy: e.target.value as any
              })}
              helperText="When schedule conflicts with existing draws"
            >
              <MenuItem value="prevent">Prevent Creation</MenuItem>
              <MenuItem value="adjust">Adjust Automatically</MenuItem>
              <MenuItem value="notify">Notify Administrators</MenuItem>
            </TextField>
          </Grid>
          
          {errors?.schedule && (
            <Grid item xs={12}>
              <Typography color="error" variant="body2">
                {errors.schedule}
              </Typography>
            </Grid>
          )}
        </Grid>
      </LocalizationProvider>

      </Card>
      
      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Schedule Summary
        </Typography>
        <Typography variant="body2">
          Sales period: {dayjs(schedule.startDate).tz(userTimezone).format('lll')} - {dayjs(schedule.endDate).tz(userTimezone).format('lll')}
        </Typography>
        <Typography variant="body2">
          Draw time: {dayjs(schedule.drawTime).tz(userTimezone).format('lll')}
        </Typography>
        <Typography variant="body2">
          Sales cutoff: {dayjs(schedule.drawTime).subtract(schedule.cutoffMinutes, 'minute').tz(userTimezone).format('lll')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          All times shown in {userTimezone}
        </Typography>
      </Box>
      
    </Box>
  );
};