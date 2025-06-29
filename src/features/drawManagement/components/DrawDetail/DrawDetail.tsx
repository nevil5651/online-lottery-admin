import {
  Dialog,
  Box,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button, } from '../../../../components/ui';
import { useDraw } from '../../apis/drawQueries';
import StatusIndicator from '../common/StatusIndicator';
import { formatDateTime } from '../../../../utils/timeUtils';
import type { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react';

interface DrawDetailProps {
  open: boolean;
  onClose: () => void;
  drawId: string;
}

interface Draw {
  name: string;
  type: string;
  schedule: {
    startDate: string;
    endDate: string;
    drawTime: string;
  };
  status: string;
  ticketPrice: number;
  security: {
    rngMethod: string;
  };
  winningNumbers?: (string | number)[];
  prizes: {
    name: string;
    valueType: 'percentage' | 'amount' | string;
    value: number;
    winners: number | string;
  }[];
}

const DrawDetail = ({ open, onClose, drawId }: DrawDetailProps) => {
  const { data: draw, isLoading } = useDraw(drawId) as { data: Draw | undefined, isLoading: boolean };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {draw?.name || 'Draw Details'}
        {draw && (
          <Chip 
            label={draw.type} 
            color="default" 
            size="small" 
            sx={{ ml: 2 }}
          />
        )}
      </DialogTitle>
      
      <DialogContent>
        {isLoading ? (
          <Box>Loading...</Box>
        ) : draw ? (
          <Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">Schedule</Typography>
                <Typography>
                  Start: {formatDateTime(draw.schedule.startDate)}
                </Typography>
                <Typography>
                  End: {formatDateTime(draw.schedule.endDate)}
                </Typography>
                <Typography>
                  Draw Time: {formatDateTime(draw.schedule.drawTime)}
                </Typography>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">Status</Typography>
                <StatusIndicator status={draw.status as any} />
                <Typography>
                  Ticket Price: ₹{draw.ticketPrice.toFixed(2)}
                </Typography>
                <Typography>
                  RNG Method: {draw.security.rngMethod}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {draw.winningNumbers && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Winning Numbers
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {draw.winningNumbers.map((num: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, i: Key | null | undefined) => (
                    <Paper key={i} sx={{ p: 2, minWidth: 40, textAlign: 'center' }}>
                      <Typography variant="h6">{num}</Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}

            <Typography variant="subtitle1" gutterBottom>
              Prize Structure
            </Typography>
            
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tier</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Winners</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {draw.prizes.map((prize: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; valueType: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; value: number; winners: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: Key | null | undefined) => (
                    <TableRow key={index}>
                      <TableCell>{prize.name}</TableCell>
                      <TableCell>
                        {prize.valueType === 'percentage' 
                          ? `${prize.value}%` 
                          : `₹${prize.value.toFixed(2)}`}
                      </TableCell>
                      <TableCell>{prize.valueType}</TableCell>
                      <TableCell>{prize.winners}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Box>Draw not found</Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DrawDetail;