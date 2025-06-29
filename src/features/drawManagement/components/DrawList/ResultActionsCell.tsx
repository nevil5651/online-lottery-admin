import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Edit, Lock, Visibility } from '@mui/icons-material';
import ResultAssignmentDialog from '../../../results/components/ResultAssignmentDialog';
import { useAuth } from '../../../../contexts/AuthContext';
import type { GameType, ResultStatus } from '../../../results';

interface Draw {
  id: string;
  status: string;
  type: string;
  resultStatus?: string;
}

const ResultActionsCell = ({ draw }: { draw: Draw }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  // Permission checks
  const canEditResults = (
    ['scheduled', 'open', 'closed'].includes(draw.status) && 
    user && ['admin', 'super-admin'].includes(user.role)
  );

  return (
    <>
      <Tooltip title={canEditResults ? "Assign Results" : "View Results"}>
        <IconButton onClick={() => setOpen(true)}>
          {canEditResults ? <Edit /> : <Visibility />}
        </IconButton>
      </Tooltip>

      <ResultAssignmentDialog
        open={open}
        onClose={() => setOpen(false)}
        drawId={draw.id}
        gameType={draw.type as GameType}
        currentStatus={(draw.resultStatus as ResultStatus) || 'draft'}
        readOnly={!canEditResults}
      />
    </>
  );
};

export default ResultActionsCell;