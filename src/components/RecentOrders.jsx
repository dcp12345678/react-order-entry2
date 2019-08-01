import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import OrdersApi from '../api/OrdersApi';
import AlertDialog from './AlertDialog';
import { connect } from 'react-redux';
import Helper from '../util/Helper';
import EditIcon from '@material-ui/icons/EditTwoTone';
import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import { withRouter, Link } from "react-router-dom";

const ordersApi = new OrdersApi();

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

class RecentOrders extends Component {

  constructor(props) {
    super(props);
    //alert(`this.props.history = ${JSON.stringify(this.props.history)}`);

    this.state = {
      orders: [],
      errorMessage: "",
      rowsPerPage: 3,
      page: 0,
    };
    this.classes = props.classes;
  }

  componentDidMount() {
    this.getOrders();
  }

  getOrders = async () => {
    try {
      let res = await ordersApi.getOrdersForUser(this.props.userDetails.userId);
      const orders = JSON.parse(res.text);
      // alert('orders = ' + JSON.stringify(orders));
      this.setState({ orders });
    } catch (err) {
      this.setState({ errorMessage: `${'could not get orders for user--' + err.status + '-' + err.description}` });
    }
  }

  sliceOrders = () => {
    const { page, rowsPerPage } = this.state;
    return this.state.orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleEditOrder = (orderId) => {
    alert(`${orderId}`);
    debugger;
    this.props.history.push("/editOrder/orderId");
  }

  render() {

    let errDialog;

    if (this.state.errorMessage !== "") {
      errDialog = (
        <div>
          <AlertDialog title="Error"
            closeAlertDialog={
              () => this.setState({ errorMessage: "" })
            }
            isAlertDialogOpen={() => this.errorMessage !== ""}
            message={`${this.state.errorMessage}`}>
          </AlertDialog>
        </div>
      );
      return errDialog;
    }

    return (
      <div>
        <h3>Recent Orders</h3>
        <Paper className={this.classes.root}>
          <div>
            <Table className={this.classes.table}>
              <colgroup>
                <col style={{ width: '5%' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="left"></TableCell>
                  <TableCell>Order Id</TableCell>
                  <TableCell align="left">Create Date</TableCell>
                  <TableCell align="left">Update Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.sliceOrders().map(row => (
                  <TableRow hover key={row.id}>
                    <TableCell align="left">
                      <Link to={`/editOrder/${row.id}`}>
                        <IconButton aria-label="Edit" >
                          <EditIcon />
                        </IconButton>
                      </Link>
                    </TableCell>
                    <TableCell align="left" component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{Helper.formatDate(row.createDate)}</TableCell>
                    <TableCell align="left">{Helper.formatDate(row.updateDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[3, 10, 25]}
            component="div"
            count={this.state.orders.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />

        </Paper>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const ret = {
    userDetails: state.userDetails,
  }
  return ret;
}

RecentOrders.propTypes = {
  classes: PropTypes.object.isRequired,
};

let comp = connect(mapStateToProps)(RecentOrders);
let comp2 = withStyles(styles)(comp);
export default withRouter(comp2);
