import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class AlertDialog extends React.Component {

  constructor(props) {
    super(props);
  }
  render() {
    debugger;
    if (this.props.isAlertDialogOpen()) {
      return (
        <div>
          <Dialog
            open="true"
            onClose={this.props.closeAlertDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {this.props.message}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.props.closeAlertDialog} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
    return null;
  }
}

export default AlertDialog;