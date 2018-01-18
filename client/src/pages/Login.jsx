import React, { Component } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GoogleButton from '../components/GoogleButton/index.jsx';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { showStatusMessage } from '../store/modules/global';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.sendLoginRequest = this.sendLoginRequest.bind(this);
    if (props.currentUser) {
      props.history.push('/');
    }
  }

  handleInputChange (property, e) {
    let stateChange = {};
    stateChange[property] = e.target.value;
    this.setState(stateChange);
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.sendLoginRequest();
    }
  }

  sendLoginRequest () {
    if (this.state.email && this.state.password) {
      axios.post('/login', {
        email: this.state.email,
        password: this.state.password
      })
        .then((res) => {
          window.location.replace(res.request.responseURL); // Performs redirect to proper page
          return res;
        })
        .catch((err) => {
          this.props.showStatusMessage('Incorrect email or password');
        });
    } else {
      let missingVals = [];
      if (!this.state.email) {
        missingVals.push('email');
      }
      if (!this.state.password) {
        missingVals.push('password');
      }
      let errorString = `Incomplete! You're missing`;
      for (let i = 0; i < missingVals.length; i++) {
        if (i === missingVals.length - 1 && missingVals.length > 1) {
          errorString += ', and ' + missingVals[i];
        } else if (i === 0) {
          errorString += ' ' + missingVals[i];
        } else {
          errorString += ', ' + missingVals[i];
        }
      }
      this.props.showStatusMessage(errorString);
    }
  }

  googleOAuthRedirect () {
    window.location.href = '/auth/google';
  }

  render() {
    const navItemStyle = {textDecoration: 'none'};
    return (
      <div className='login center'>
        <h1>Login</h1>
        <TextField onKeyPress={this.handleKeyPress} hintText='hello@world.com' floatingLabelText='Email' type='email' value={this.state.email} onChange={this.handleInputChange.bind(this, 'email')} /><br/>
        <TextField onKeyPress={this.handleKeyPress} floatingLabelText='Password' type='password' value={this.state.password} onChange={this.handleInputChange.bind(this, 'password')} /><br/>
        <RaisedButton className='btn' onClick={this.sendLoginRequest}>Login</RaisedButton>
        <NavLink to='/signup' style={navItemStyle}>
          <FlatButton className='btn'>Sign Up</FlatButton><br/>
        </NavLink>
        <GoogleButton className='btn' onClick={this.googleOAuthRedirect} />
      </div>
    );
  }
}

const mapStateToProps = ({global}) => ({
  currentUser: global.currentUser
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  showStatusMessage
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);