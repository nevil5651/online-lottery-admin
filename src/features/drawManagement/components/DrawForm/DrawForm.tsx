import  { useState } from 'react';
import {  
  Dialog, 
  Stepper,
  Step,
  StepLabel,
  Box
} from '@mui/material';
import { Button,DialogTitle, DialogActions, DialogContent } from '../../../../components/ui';
import { Formik, Form } from 'formik';
import type { Draw } from '../../types/drawTypes';
import ScheduleControls from './ScheduleControls';
import PrizeTierEditor from './PrizeTierEditor';
import SecuritySettings from './SecuritySettings';
import { useCreateDraw, useUpdateDraw } from '../../apis/drawQueries';
import { drawValidationSchema } from '../../../../hooks/useDrawMnValidation';

interface DrawFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  draw?: Draw;
}

const steps = ['Schedule', 'Prizes', 'Security', 'Review'];

const DrawForm = ({ open, onClose, onSuccess, draw }: DrawFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const createMutation = useCreateDraw();
  const updateMutation = useUpdateDraw();
  
  const initialValues: Partial<Draw> = draw || {
    name: '',
    type: 'daily',
    ticketPrice: 50,
    status: 'scheduled',
    prizes: [],
    schedule: {
      startDate: new Date(),
      endDate: new Date(),
      drawTime: new Date(),
      cutoffMinutes: 15,
      isRecurring: false,
    },
    security: {
      rngMethod: 'algorithm',
      requiredApprovals: 1,
      approvedBy: [],
    }
  };
  
  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
  
  const handleSubmit = async (values: Partial<Draw>) => {
    try {
      if (draw) {
        await updateMutation.mutateAsync({ id: draw.id, data: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving draw:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {draw ? 'Edit Draw' : 'Create New Draw'}
      </DialogTitle>
      
      <Formik
        initialValues={initialValues}
        validationSchema={drawValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isValid, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              {activeStep === 0 && <ScheduleControls />}
              {activeStep === 1 && <PrizeTierEditor />}
              {activeStep === 2 && <SecuritySettings />}
              {activeStep === 3 && (
                <Box>
                  {/* Review content */}
                </Box>
              )}
            </DialogContent>
            
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={handleBack} disabled={activeStep === 0}>
                Back
              </Button>
              {activeStep < steps.length - 1 ? (
                <Button 
                  variant="contained" 
                  onClick={handleNext}
                  disabled={!isValid}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={isSubmitting}
                >
                  {draw ? 'Update Draw' : 'Create Draw'}
                </Button>
              )}
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default DrawForm;