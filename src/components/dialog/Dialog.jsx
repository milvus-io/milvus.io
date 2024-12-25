import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { DialogActions } from '@mui/material';

export const BootstrapDialogTitle = props => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2, fontFamily: 'Geist' }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export const CustomizedDialogs = props => {
  const { open, handleClose, title, content } = props;

  return (
    <>
      <Dialog
        onClose={handleClose}
        open={open}
        sx={{
          fontFamily: 'Geist',
        }}
      >
        <BootstrapDialogTitle onClose={handleClose}>
          {title}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>{content}</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const CustomizedContentDialogs = props => {
  const { open, handleClose, title, actions, classes = {} } = props;

  const {
    title: customTitleClass = '',
    actions: customActionClass = '',
    root = '',
  } = classes;

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="xl"
      classes={{
        paper: root,
      }}
    >
      <BootstrapDialogTitle
        onClose={handleClose}
        classes={{ root: customTitleClass }}
      >
        {title}
      </BootstrapDialogTitle>
      <DialogContent>{props.children}</DialogContent>
      {actions && (
        <DialogActions classes={{ root: customActionClass }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};
