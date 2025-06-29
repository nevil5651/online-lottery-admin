import { 
  Stepper, 
  Step,
  StepLabel, 
  StepContent,
  Stack,
  Box
} from '@mui/material';
import { Typography,Button} from '../../../components/ui';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useApprovalWorkflow } from '../hooks/useApprovalWorkflow';
import { type ResultStatus } from '../types/resultTypes';

interface ApprovalWorkflowStepperProps {
  currentStatus: ResultStatus;
  results: number[];
  drawId: string;
  userId: string;
  userRole: string;
  onSuccess: () => void;
  onError: (message: string) => void;
  readOnly?: boolean;
}

const ApprovalWorkflowStepper = ({
  currentStatus,
  results,
  drawId,
  userId,
  userRole
}: ApprovalWorkflowStepperProps) => {
  const {
    activeStep,
    approvalList,
    submitResults,
    approveResults,
    publishResults,
    isSubmitting
  } = useApprovalWorkflow(drawId, userId, userRole, results);
  
  const steps = [
    'Generate Results',
    'Internal Verification',
    ...(approvalList.length > 1 ? ['Secondary Approval'] : []),
    'Publish to Public'
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Approval Workflow
      </Typography>
      
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label} completed={index < activeStep}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {index === 0 ? (
                <Button
                  variant="contained"
                  disabled={results.length === 0 || isSubmitting}
                  onClick={submitResults}
                  startIcon={<CheckCircleIcon />}
                >
                  Submit for Approval
                </Button>
              ) : index === steps.length - 1 ? (
                <Stack spacing={2}>
                  <Typography>
                    Final step: Results will be visible to all players
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={publishResults}
                    disabled={isSubmitting || currentStatus === 'locked'}
                  >
                    Publish Results
                  </Button>
                </Stack>
              ) : (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography>
                    Approval required from: {approvalList[index - 1]}
                  </Typography>
                  {userRole === 'admin' && (
                    <Button
                      variant="outlined"
                      onClick={() => approveResults(index)}
                    >
                      Approve
                    </Button>
                  )}
                </Stack>
              )}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ApprovalWorkflowStepper;