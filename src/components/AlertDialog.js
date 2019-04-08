import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function AlertDialog({userChoice, handleOpen, content, title}) {
  const defaultMessage = 'There is no provided message, please add one! ';
  return (
    <div>
      <Dialog
        open={handleOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{ title ? title : null }</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { content ? content : defaultMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => userChoice('cancel')} color="primary">
            Cancel
          </Button>
          <Button onClick={() => userChoice('ok')} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AlertDialog;