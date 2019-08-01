import React, { Component } from 'react';
import SignIn from './SignIn';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import MiniDrawer from './MiniDrawer';
import RecentOrders from './RecentOrders';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class Main extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.isLoggedIn) {
      return (
        <div>
          <RecentOrders />
        </div>
      );
    }
    return (
      <div>
        <SignIn></SignIn>
      </div>
    )
  }
}

function mapStateToProps(state) {
  let ret = {
    isLoggedIn: state.isLoggedIn,
  }
  return ret;
}

const mapDispatchToProps = dispatch => {
}


let comp = connect(mapStateToProps, mapDispatchToProps)(Main);
export default withStyles(styles)(withRouter(comp));