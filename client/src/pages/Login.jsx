import React, { Component } from 'react';
import { connect } from 'react-redux';
import GoogleButton from '../components/GoogleButton/index.jsx';

class Login extends Component {
  constructor(props) {
    super(props);
    if (props.user) {
      props.history.push('/');
    }
  }

  googleOAuthRedirect() {
    window.location.href = '/auth/google';
  }

  render() {
    return (
      <div className='login center'>
        <h1>Login</h1>
        <GoogleButton className='btn' onClick={this.googleOAuthRedirect} />
      </div>
    );
  }
}

const mapStateToProps = ({global}) => ({
  user: global.user
});

export default connect(mapStateToProps)(Login);