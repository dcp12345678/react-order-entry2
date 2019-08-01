import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import AlertDialog from './AlertDialog';
import Helper from '../util/Helper';
import AuthApi from '../api/AuthApi';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { setIsLoggedIn, setUserDetails } from '../actions';
import { bindActionCreators } from 'redux';

const authApi = new AuthApi();

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },

  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class SignIn extends Component {

  constructor(props) {
    super(props);

    // initial state
    this.state = {
      loginId: '',
      password: '',
      isAlertDialogOpen: false,
      isLoginInProgress: false,
      errorMessage: ''
    };
  }

  isAlertDialogOpen = () => {
    return this.state.isAlertDialogOpen;
  }

  closeAlertDialog = () => {
    this.setState({ isAlertDialogOpen: false })
  }

  onChange = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  doLogin = async (event) => {
    event.preventDefault();
    this.setState({ isLoginInProgress: true });
    if (Helper.isNullOrWhitespace(this.state.loginId) || Helper.isNullOrWhitespace(this.state.password)) {
      this.setState({
        isAlertDialogOpen: true,
        isLoginInProgress: false,
        errorMessage: "You must enter a login Id and password!"
      });
    } else {
      try {
        let loginResult = await authApi.login(this.state.loginId, this.state.password);
        const obj = JSON.parse(loginResult.text);
        if (obj.result === 'successful login') {
          Helper.setSessionStorageObject('userDetails', { userId: obj.userId, sessionId: obj.sessionId });
          this.setState({
            isLoginInProgress: false
          });
          this.props.history.push('/home');
          this.props.setUserDetails({ userId: obj.userId, sessionId: obj.sessionId });
          this.props.setIsLoggedIn(true);
        } else {
          let errMsg = obj.result;

          if (!errMsg.endsWith(".")) {
            errMsg += ".";
          }

          this.setState({
            isAlertDialogOpen: true,
            isLoginInProgress: false,
            errorMessage: errMsg
          });
        }
      } catch (err) {
        alert(`err = ${err}`);
        this.setState({
          isAlertDialogOpen: true,
          isLoginInProgress: false,
          errorMessage: err.response || '-- could not login'
        });
      }
    }
  }
  render() {
    const { classes } = this.props;

    let errDialog;
    if (this.isAlertDialogOpen()) {
      errDialog = (
        <div>
          <AlertDialog title="Error"
            closeAlertDialog={this.closeAlertDialog}
            isAlertDialogOpen={this.isAlertDialogOpen}
            message={`${this.state.errorMessage} Please try again, dumbo.`}></AlertDialog>
        </div>
      );
    }

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="loginId">Login Id</InputLabel>
            <Input id="loginId" name="loginId" autoComplete="loginId" autoFocus onChange={this.onChange} />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input name="password" type="password" id="password" autoComplete="current-password"
              onChange={this.onChange} />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={this.doLogin}
            className={classes.submit}
          >
            Sign in
          </Button>
          {errDialog}
          {this.state.isLoginInProgress && <CircularProgress style={{ marginTop: 10 }} size={40} />}
        </Paper>
      </main>
    )
  }
}

function mapStateToProps(state) {
  let ret = {
    array: state.array,
  }
  return ret;
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setIsLoggedIn, setUserDetails }, dispatch)
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

let comp = connect(mapStateToProps, mapDispatchToProps)(SignIn);
export default withStyles(styles)(withRouter(comp));