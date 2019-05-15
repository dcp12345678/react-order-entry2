import React, { Component } from 'react';
import { Provider } from 'react-redux'
import rootReducer from './reducers/rootReducer'
import './App.css';
import Main from './components/Main';
import { configureStore } from 'redux-starter-kit'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const store = configureStore({
  reducer: rootReducer
})

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Main></Main>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
