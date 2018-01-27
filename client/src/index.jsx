import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/index.js';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Settings from './pages/Settings.jsx';
import Navbar from './components/Navbar.jsx';
import StatusBar from './components/StatusBar.jsx';
import { BrowserRouter } from 'react-router-dom';
import '../dist/styles.css';
import { Router, Route, browserHistory, Switch } from 'react-router';

render(
  <Provider store={store}>
    <BrowserRouter basename='/'>
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div>
          <Navbar/>
          <StatusBar/>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/settings' component={Settings}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
      </MuiThemeProvider>
    </BrowserRouter>
  </Provider>
  , document.getElementById('app'));