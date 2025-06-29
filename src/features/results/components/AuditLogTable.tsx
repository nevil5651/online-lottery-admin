import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
} from '@mui/material';
import { Typography } from '../../../components/ui';
import { useResultHistory } from '../api/resultQueries';
import { formatDateTime } from '../../../utils/timeUtils';

interface AuditLogTableProps {
  drawId: string;
}

const AuditLogTable = ({ drawId }: AuditLogTableProps) => {
  const { data: history = [], isLoading } = useResultHistory(drawId);

  if (isLoading) return <Typography>Loading history...</Typography>;
  if (history.length === 0) return <Typography>No audit history</Typography>;

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Audit History
      </Typography>
      
      <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.flatMap(result => 
              result.auditTrail.map((entry, index) => (
                <TableRow key={`${result.id}-${index}`}>
                  <TableCell>{entry.action}</TableCell>
                  <TableCell>{entry.userId}</TableCell>
                  <TableCell>{formatDateTime(entry.timestamp)}</TableCell>
                  <TableCell>
                    {entry.action === 'create' && `Method: ${result.rngMethod}`}
                    {entry.action === 'approve' && `Approval step: ${index}`}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AuditLogTable;