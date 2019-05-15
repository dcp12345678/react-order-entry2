import React, { Component } from 'react';
import SignIn from './SignIn';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import MiniDrawer from './MiniDrawer';
import RecentOrders from './RecentOrders';

class Main extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.isLoggedIn) {
      debugger;
      return (
        <div>
          <MiniDrawer>
            <RecentOrders />
          </MiniDrawer>
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
export default withRouter(comp);