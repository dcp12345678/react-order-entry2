import React, { Component } from 'react';
import { Provider } from 'react-redux'
import rootReducer from './reducers/rootReducer'
import './App.css';
import Main from './components/Main';
import EditOrder from './components/EditOrder';
import { configureStore } from 'redux-starter-kit'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import MiniDrawer from './components/MiniDrawer';

const store = configureStore({
  reducer: rootReducer
})

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MiniDrawer>
          <Router>
            <Route exact path="/" component={Main} />
            <Route exact path="/home" component={Main} />
            <Route path="/editOrder/:id" component={EditOrder} />
          </Router>
        </MiniDrawer>
      </Provider>
    );
  }
}

export default App;
