import { createAction } from 'redux-starter-kit';

const setIsLoggedIn = createAction('SET_IS_LOGGED_IN');

const setUserDetails = createAction('SET_USER_DETAILS');

export {
  setIsLoggedIn,
  setUserDetails
};