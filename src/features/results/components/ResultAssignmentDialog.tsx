import { useState, useEffect } from 'react';
import {
  Dialog,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  DialogTitle,
  DialogContent} from '../../../components/ui';
import ManualEntryForm from './ManualEntryForm';
import AutoGeneratorPanel from './AutoGeneratorPanel';
import ResultPreviewCard from './ResultPreviewCard';
import ApprovalWorkflowStepper from './ApprovalWorkflowStepper';
import AuditLogTable from './AuditLogTable';
import StatusChip from './StatusChip';
import { useAuth } from '../../../contexts/AuthContext';
import type { GameType, ResultStatus } from '../types/resultTypes';
import { useResultUpdate } from '../../../contexts/ResultUpdateContext';
import { useGetExistingResults } from '../api/resultQueries';

interface ResultAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  drawId: string;
  gameType: GameType;
  currentStatus: ResultStatus;
  readOnly?: boolean;
}

const ResultAssignmentDialog = ({
  open,
  onClose,
  drawId,
  gameType,
  currentStatus,
  readOnly = false
}: ResultAssignmentDialogProps) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'auto'>('manual');
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { onResultUpdate } = useResultUpdate();

  const {
    data: existingResults,
    isLoading,
    isError
  } = useGetExistingResults(drawId, {
    enabled: open
  }) as {
    data: { numbers: number[] } | undefined,
    isLoading: boolean,
    isError: boolean
  };

  useEffect(() => {
    if (existingResults?.numbers) {
      setResults(existingResults.numbers);
    } else {
      setResults([]);
    }
  }, [existingResults, open]); // Added open to dependencies

  const handleSuccess = () => {
    onResultUpdate();
    onClose();
    setError(null);
  };

  const handleError = (message: string) => {
    setError(message);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'manual' | 'auto') => {
    if (!readOnly) {
      setActiveTab(newValue);
      setError(null);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <CircularProgress />
          <p>Loading existing results...</p>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Alert severity="error">
            Failed to load existing results. Please try again.
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          minHeight: '70vh'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{`Assign Results - Draw #${drawId}`}</span>
        <StatusChip status={currentStatus} />
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          variant="fullWidth"
        >
          <Tab
            label="Manual Entry"
            value="manual"
            disabled={readOnly}
          />
          <Tab
            label="Auto Generate"
            value="auto"
            disabled={readOnly}
          />
        </Tabs>

        <Box sx={{
          display: 'flex',
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' },
          minHeight: '50vh'
        }}>
          <Box sx={{ flex: 1 }}>
            {activeTab === 'manual' ? (
              <ManualEntryForm
                gameType={gameType}
                onResultsChange={setResults}
                initialValues={existingResults?.numbers}
                disabled={readOnly}
              />
            ) : (
              <AutoGeneratorPanel
                gameType={gameType}
                onGenerate={setResults}
                disabled={readOnly}
              />
            )}

            <ResultPreviewCard
              results={results}
              gameType={gameType}
            />
          </Box>

          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            {user && (
              <ApprovalWorkflowStepper
                currentStatus={currentStatus}
                results={results}
                drawId={drawId}
                userId={user.id}
                userRole={user.role}
                onSuccess={handleSuccess}
                onError={handleError}
                readOnly={readOnly}
              />
            )}

            <AuditLogTable
              drawId={drawId}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ResultAssignmentDialog;