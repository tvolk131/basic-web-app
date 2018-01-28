import React, { Component } from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Home extends Component {
  constructor(props) {
    super(props);
    if (!props.user) {
      props.history.push('/login');
    }
  }

  render() {
    return (
      <div className="content-wrap">
        Homepage
      </div>
    ); 
  }
}

const mapStateToProps = ({global}) => ({
  user: global.user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);