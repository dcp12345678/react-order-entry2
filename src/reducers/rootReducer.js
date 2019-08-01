import { createReducer } from 'redux-starter-kit'

let initialState = {
  name: 'joey',
  array: [],
  isLoggedIn: false,
  userDetails: {}
};

const rootReducer = createReducer(initialState, {
  "ACTION1": (state, action) => {
    state.name = action.payload;
  },
  "ACTION2": (state, action) => {
    state.array.push(action.payload);
  },
  "SET_IS_LOGGED_IN": (state, action) => {
    state.isLoggedIn = action.payload;
  },
  "SET_USER_DETAILS": (state, action) => {
    state.userDetails = action.payload
  }
});

export default rootReducer;