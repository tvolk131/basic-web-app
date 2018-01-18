import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hideStatusMessage } from '../store/modules/global';

const StatusBar = (props) => (
  <Snackbar open={props.isVisible} message={props.message} autoHideDuration={4000} onRequestClose={props.hideStatusMessage} />
);

const mapStateToProps = ({global}) => ({
  message: global.statusMessage,
  isVisible: global.statusVisible
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  hideStatusMessage
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar);