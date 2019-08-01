import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import OrdersApi from '../api/OrdersApi';
import LookupApi from '../api/LookupApi';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';
import SaveIcon from '@material-ui/icons/SaveTwoTone';
import _ from 'lodash';
import Helper from '../util/Helper';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import produce from 'immer';
import IconButton from '@material-ui/core/IconButton';
import YesNoDialog from './YesNoDialog';
import Config from '../config';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit * 1,
  },
});

const ordersApi = new OrdersApi();
const lookupApi = new LookupApi();

class EditOrder extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      showModalForDelete: false,
      showModalForSave: false,
      showModalForError: false,
      isNew: this.props.match.params.id === '-1',
      rowsPerPage: 3,
      page: 0,
    };

    this.classes = props.classes;
  }

  componentDidMount() {
    this.prepareComponent();
  }

  prepareComponent = async () => {
    try {
      let res = await lookupApi.getColors();
      const colors = JSON.parse(res.text);
      res = await lookupApi.getProductTypes();
      const productTypes = JSON.parse(res.text);
      this.setState({ colors, productTypes });

      let order;
      //alert(`this.props.match.params.id = ${this.props.match.params.id}`);
      if (!this.state.isNew) {
        // editing an existing order
        const x = await ordersApi.getOrder(this.props.match.params.id);
        order = JSON.parse(x.text);

        // get available products for each line item on the order
        const promiseResults =
          await Promise.all(
            _.map(
              order.lineItems,
              async (lineItem) => await lookupApi.getProductsForProductType(lineItem.productTypeId)
            )
          );
        // load available products to each line item
        _.forEach(order.lineItems, (lineItem, index) => {
          lineItem.availProducts = JSON.parse(promiseResults[index].text);
        });
      } else {
        // create a new order
        order = {};
        order.id = -1;
        order.lineItems = [];
      }
      order.userId = this.props.userDetails.userId;
      this.setState({ order, isLoaded: true });
    } catch (err) {
      this.setState(
        {
          showModalForError: true,
          errorModalTitle: 'Error initializing form',
          errorModalBody: `Error details: ${err.message} ${err.stack}`,
        });
    }
  }

  /**
   * Called when user changes the product for a line item
   */
  onProductChanged = (lineItem, event) => {
    const selProductId = event.target.value;

    this.setState(
      produce(curState => {
        const index = _.findIndex(curState.order.lineItems, ['id', lineItem.id]);
        lineItem.productId = parseInt(selProductId, 10);
        const productIndex = _.findIndex(lineItem.availProducts, ['id', lineItem.productId]);
        let product = lineItem.availProducts[productIndex];
        lineItem.productImageUri = product.imageUri;
        lineItem.showSaveButton = true;
        curState.order.lineItems[index] = lineItem;
      })
    );
  }

  /**
  * Called when user changes the color for a line item
  */
  onColorChanged = (lineItem, event) => {
    const selColorId = event.target.value;

    this.setState(
      produce(curState => {
        const index = _.findIndex(curState.order.lineItems, ['id', lineItem.id]);
        lineItem.colorId = parseInt(selColorId, 10);
        lineItem.showSaveButton = true;
        curState.order.lineItems[index] = lineItem;
      })
    );
  }

  /**
   * Called when user changes the product type for a line item
   */
  onProductTypeChanged = async (lineItem, event) => {
    debugger;
    const selProductTypeId = event.target.value;

    try {
      const res = await lookupApi.getProductsForProductType(selProductTypeId);
      const productTypeId = parseInt(selProductTypeId, 10);
      const products = JSON.parse(res.text);

      this.setState(
        produce(curState => {
          debugger;
          const index = _.findIndex(curState.order.lineItems, ['id', lineItem.id]);
          lineItem.availProducts = products;
          lineItem.productTypeId = productTypeId;
          lineItem.productId = -1; // deselect any previously selected product
          lineItem.colorId = -1; // deselect any previously selected color
          lineItem.productImageUri = ''; // clear out any product image
          lineItem.showSaveButton = true;
          curState.order.lineItems[index] = lineItem;
        })
      );
    } catch (err) {
      debugger;
      this.setState(
        {
          showModalForError: true,
          errorModalTitle: 'Error getting products for product type',
          errorModalBody: `Error details: ${err.message} ${err.stack}`,
        });
    }
  }

  /**
   * Prompts user to make sure they want to delete the line item
   * @param {Number} id the id of line item to delete
   */
  promptToDeleteLineItem = (id) => {
    this.setState({ idToDelete: id, showModalForDelete: true });
  }

  /**
   * Deletes the line item from persistence.
   * @param {Number} id the id of line item to delete
   */
  deleteLineItem = async (id) => {
    const updatedOrder = produce(this.state.order, draftOrder => {
      const index = _.findIndex(draftOrder.lineItems, ['id', id]);
      draftOrder.lineItems.splice(index, 1);  // delete the line item
    });

    // delete the order from persistence
    await ordersApi.saveOrder(updatedOrder);

    this.setState(
      produce(curState => {
        curState.order = updatedOrder;
      })
    );

  }

  saveLineItem = async (lineItem) => {
    try {
      const res = await ordersApi.saveOrder(this.state.order);
      const resObj = JSON.parse(res.text);

      this.setState(
        produce(curState => {
          debugger;
          curState.order.id = parseInt(resObj.orderId, 10);
        })
      );
    } catch (err) {
      this.setState(
        {
          showModalForError: true,
          errorModalTitle: 'Error saving order',
          errorModalBody: `Error details: ${err.message} ${err.stack}`,
        });
    }

  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  sliceLineItems = () => {
    const { page, rowsPerPage } = this.state;
    return this.state.order.lineItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }

  render() {
    if (!this.state.isLoaded) {
      return (<h3>loading...</h3>);
    }

    const rows = [];
    _.forEach(this.sliceLineItems(), (lineItem) => {
      rows.push(
        <TableRow hover>
          <TableCell>
            {lineItem.id}
          </TableCell>
          <TableCell>
            {lineItem.productImageUri != '' &&
              <img height="50" width="75" src={`${Config.restApi.baseUrl}${lineItem.productImageUri}`}></img>}
          </TableCell>
          <TableCell>

            <NativeSelect
              onChange={(event) => this.onProductTypeChanged(lineItem, event)}
            >
              {Helper.buildOptionsForSelectList(this.state.productTypes, lineItem.productTypeId)}
            </NativeSelect>

          </TableCell>
          <TableCell>
            {/* only show products select list if a product type has been selected */}
            {lineItem.availProducts.length > 0 &&
              <NativeSelect
                onChange={(event) => this.onProductChanged(lineItem, event)} >
                {Helper.buildOptionsForSelectList(lineItem.availProducts, lineItem.productId)}
              </NativeSelect>
            }
          </TableCell>
          <TableCell>
            {/* only show colors select list if a product type has been selected */}
            {lineItem.availProducts.length > 0 &&
              <NativeSelect
                onChange={(event) => this.onColorChanged(lineItem, event)} >
                {Helper.buildOptionsForSelectList(this.state.colors, lineItem.colorId)}
              </NativeSelect>
            }
          </TableCell>
          <TableCell style={{ textAlign: 'left' }}>
            {lineItem.showSaveButton === true &&
              <IconButton aria-label="Save"
                color="primary"
                onClick={() => this.saveLineItem()}
              >
                <SaveIcon />
              </IconButton>
            }
            <IconButton aria-label="Delete"
              color="secondary"
              onClick={() => this.promptToDeleteLineItem(lineItem.id)}
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>);
    });

    return (
      <div>
        <h3>{this.state.isNew ? 'Create New Order' : `Edit Order ${this.props.match.params.id}`}</h3>
        <div>
            <YesNoDialog title="Confirm Delete"
              closeYesNoDialog={
                (answer) => {
                  if (answer === 'yes') {
                    this.deleteLineItem(this.state.idToDelete);
                  }
                  this.setState({ showModalForDelete: false })
                }
              }
              isYesNoDialogOpen={() => this.state.showModalForDelete}
              message={`Are you sure you want to delete this line item?`}>
            </YesNoDialog>
          </div>

        <Paper className={this.classes.root}>
          <div>
            <Table className={this.classes.table}>
              <colgroup>
                <col style={{ width: '7%' }} />
                <col />
                <col />
                <col />
                <col />
                <col style={{ width: '15%' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Line Item Id</TableCell>
                  <TableCell align="left">Image</TableCell>
                  <TableCell>Product Type</TableCell>
                  <TableCell align="left">Product</TableCell>
                  <TableCell align="left">Color</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[3, 10, 25]}
            component="div"
            count={this.state.order.lineItems.length}
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

EditOrder.propTypes = {
  classes: PropTypes.object.isRequired,
};

let comp = connect(mapStateToProps)(EditOrder);
export default withStyles(styles)(comp);