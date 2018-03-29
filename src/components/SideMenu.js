import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ListView,
  Image,
  Button,
} from 'react-native';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import _ from 'lodash';
import CourseCell from './CourseCell';
import { bindActionCreators } from 'redux';
import CoursesActionCreators from '../actions/courses';
import AccountActionCreators from '../actions/account';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    flex:1,
  },
  avatar: {
    height:80,
    width: 80
  },
  userinfoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
  },
});

class SideMenu extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    const { accountActions } = this.props;
    accountActions.logout();
    Actions.pop();
  }

  render() {
    const { account } = this.props;
    return (
      <View style = { styles.container }>
        <Image style = {styles.avatar} source={require('../images/user.png')} />
        <View style={styles.userinfoContainer}>
          <Text>{account.username}</Text>
          <Button onPress = { this.logout }>
            Log Out
          </Button>
        </View>
      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(AccountActionCreators, dispatch),
  };
}

function mapStateToProps(state) {
  return {
    account: state.account,
  };
}

SideMenu.propTypes = {
  account: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
