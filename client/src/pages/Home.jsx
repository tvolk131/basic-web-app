import React, { Component } from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Home extends Component {
  constructor(props) {
    super(props);
    if (!props.currentUser) {
      props.history.push('/login');
    }
  }

  render() {
    return (
      <div>
        Homepage
      </div>
    ); 
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  removeFriend
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);