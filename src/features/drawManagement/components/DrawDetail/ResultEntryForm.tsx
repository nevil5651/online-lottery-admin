import {
  Dialog, 
  Stack
} from '@mui/material';
import { TextField, Typography, Button ,DialogTitle,
  DialogContent,
  DialogActions,  } from '../../../../components/ui';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { usePostResults } from '../../apis/drawQueries';

interface ResultEntryFormProps {
  open: boolean;
  onClose: () => void;
  draw: {
    id: string;
    type: string;
    name: string;
  };
}

const validationSchema = Yup.object({
  winningNumbers: Yup.array()
    .of(Yup.number().required())
    .required('Winning numbers are required')
});

const ResultEntryForm = ({ open, onClose, draw }: ResultEntryFormProps) => {
  const postResults = usePostResults();
  
  const formik = useFormik({
    initialValues: {
      winningNumbers: [] as number[]
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await postResults.mutateAsync({
          id: draw.id,
          winningNumbers: values.winningNumbers
        });
        onClose();
      } catch (error) {
        console.error('Error posting results:', error);
      }
    }
  });

  const handleNumberChange = (index: number, value: string) => {
    const num = parseInt(value, 10);
    const newNumbers = [...formik.values.winningNumbers];
    newNumbers[index] = isNaN(num) ? 0 : num;
    formik.setFieldValue('winningNumbers', newNumbers);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Post Results for {draw.name}</DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Enter the winning numbers for this {draw.type} draw:
          </Typography>
          
          <Stack direction="row" spacing={2} sx={{ my: 3 }}>
            {[1, 2, 3, 4, 5, 6].slice(0, draw.type === 'pick3' ? 3 : draw.type === 'pick4' ? 4 : 6).map((_, i) => (
              <TextField
                key={i}
                value={formik.values.winningNumbers[i] || ''}
                onChange={(e) => handleNumberChange(i, e.target.value)}
                type="number"
                inputProps={{ min: 1, max: 99 }}
                error={Boolean(formik.touched.winningNumbers && formik.errors.winningNumbers)}
                sx={{ width: 80 }}
              />
            ))}
          </Stack>
          
          {formik.errors.winningNumbers && (
            <Typography color="error" variant="body2">
              {formik.errors.winningNumbers as string}
            </Typography>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={!formik.isValid || postResults.status === 'pending'}
          >
            Confirm Results
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ResultEntryForm;