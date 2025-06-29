import { useState, useEffect } from 'react';
import { useSubmitResults, useApproveResults, usePublishResults } from '../api/resultQueries';
import type { ResultStatus } from '../types/resultTypes';

export const useApprovalWorkflow = (
  drawId: string,
  userId: string,
  userRole: string,
  results: number[]
) => {
  const [activeStep, setActiveStep] = useState(0);
  const [approvalList, setApprovalList] = useState<string[]>([]);
  const [status, setStatus] = useState<ResultStatus>('draft');
  
  const submitMutation = useSubmitResults();
  const approveMutation = useApproveResults();
  const publishMutation = usePublishResults();

  // Initialize approval workflow based on user role
  useEffect(() => {
    if (userRole === 'super-admin') {
      setApprovalList([]); // No approval needed
      setActiveStep(3); // Skip to publish step
    } else if (userRole === 'admin') {
      setApprovalList(['super-admin-1@lottery.com']);
      setActiveStep(1);
    } else {
      setApprovalList(['admin-1@lottery.com', 'super-admin-1@lottery.com']);
      setActiveStep(1);
    }
  }, [userRole]);

  const submitResults = async () => {
    if (results.length === 0) return;
    
    try {
      await submitMutation.mutateAsync({
        drawId,
        gameType: 'pick6', // Should be dynamic
        numbers: results,
        requireApproval: approvalList.length > 0
      });
      setStatus('pending_approval');
      setActiveStep(2);
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  const approveResults = async (stepIndex: number) => {
    try {
      // In real app, we'd have resultId from submission response
      await approveMutation.mutateAsync({ 
        resultId: 'temp-result-id', 
        userId 
      });
      
      if (stepIndex === approvalList.length - 1) {
        setActiveStep(3); // Move to publish step
      } else {
        setActiveStep(prev => prev + 1);
      }
    } catch (error) {
      console.error('Approval failed', error);
    }
  };

  const publishResults = async () => {
    try {
      await publishMutation.mutateAsync('temp-result-id');
      setStatus('published');
      setActiveStep(4);
    } catch (error) {
      console.error('Publishing failed', error);
    }
  };

  return {
    activeStep,
    approvalList,
    status,
    submitResults,
    approveResults,
    publishResults,
    isSubmitting: submitMutation.status === 'pending' || 
                 approveMutation.status === 'pending' || 
                 publishMutation.status === 'pending'
  };
};