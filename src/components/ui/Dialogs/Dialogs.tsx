import React from 'react';
import {
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
   type DialogTitleProps,
  type DialogContentProps,
  type DialogActionsProps,
  type DialogProps,
} from '@mui/material';
import { Button } from '../Buttons/Button';

type BaseDialogProps = DialogProps & {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const BaseDialog = ({ open, onClose, children, ...props }: BaseDialogProps) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" {...props}>
    {children}
  </Dialog>
);

type DialogTitlePropsExtended = DialogTitleProps & {
  onClose?: () => void;
};

export const DialogTitle = ({ children, onClose, ...props }: DialogTitlePropsExtended) => (
  <MuiDialogTitle sx={{ m: 0, p: 2 }} {...props}>
    {children}
    {onClose && <Button onClick={onClose} />}
  </MuiDialogTitle>
);

export const DialogContent = ({ children, ...props }: DialogContentProps) => (
  <MuiDialogContent dividers {...props}>
    {children}
  </MuiDialogContent>
);

export const DialogActions = ({ children, ...props }: DialogActionsProps) => (
  <MuiDialogActions {...props}>
    {children}
  </MuiDialogActions>
);