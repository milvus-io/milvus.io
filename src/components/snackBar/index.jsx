import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const CustomizedSnackbars = ({
  open,
  duration = 6000,
  handleClose = () => { },
  type = "info",
  message = ''
}) => {
  const [vertical, horizontal] = ['top', 'right'];

  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={handleClose} anchorOrigin={{ vertical, horizontal }}>
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
