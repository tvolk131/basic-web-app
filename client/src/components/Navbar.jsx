import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openNavbar, closeNavbar, setNavbar } from '../store/modules/global';
import { Drawer, MenuItem, AppBar, FlatButton } from 'material-ui';
import { NavLink } from 'react-router-dom';
import { Home, ExitToApp, ViewList, VideogameAsset, Settings, ViewCarousel } from 'material-ui-icons';
const navItemStyle = {textDecoration: 'none'};

const Navbar = (props) => (
  <div>
    <AppBar
      title='App'
      onLeftIconButtonTouchTap={props.openNavbar}
    />
    <Drawer docked={false} width={250} open={props.isOpen} onRequestChange={(input) => props.setNavbar(input)}>
      {props.user ?
        <div>
          <NavLink to='/' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar} leftIcon={<Home/>}>Home</MenuItem>
          </NavLink>
          <MenuItem onClick={() => { window.location.replace('/logout'); }} leftIcon={<ExitToApp/>}>Logout</MenuItem>
        </div>
        :
        <NavLink to='/login' style={navItemStyle}>
          <MenuItem onClick={props.closeNavbar} leftIcon={<ExitToApp/>}>Login/Signup</MenuItem>
        </NavLink>}
    </Drawer>
  </div>
);

const mapStateToProps = ({global}) => ({
  user: global.user,
  isOpen: global.navbarOpen
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  openNavbar,
  closeNavbar,
  setNavbar
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);