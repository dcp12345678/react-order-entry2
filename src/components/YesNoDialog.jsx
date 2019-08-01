import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class YesNoDialog extends React.Component {

  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.isYesNoDialogOpen()) {
      return (
        <div>
          <Dialog
            open="true"
            onClose={this.props.closeYesNoDialog}
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
              <Button onClick={() => this.props.closeYesNoDialog("yes")} color="primary">
                Yes
              </Button>
              <Button onClick={() => this.props.closeYesNoDialog("no")} color="primary">
                No
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
    return null;
  }
}

export default YesNoDialog;