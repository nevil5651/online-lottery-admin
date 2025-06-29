import { DialogTitle as MuiDialogTitle, type DialogTitleProps } from '@mui/material';

import { CloseButton } from '../Buttons/CloseButton';

interface CustomDialogTitleProps extends DialogTitleProps {
  onClose?: () => void;
}

export const DialogTitle = ({ children, onClose, ...props }: CustomDialogTitleProps) => (
  <MuiDialogTitle sx={{ m: 0, p: 2 }} {...props}>
    {children}
    {onClose && <CloseButton onClick={onClose} />}
  </MuiDialogTitle>
);