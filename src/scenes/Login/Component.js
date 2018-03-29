
import { Actions } from 'react-native-router-flux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  Image,
  TouchableOpacity
} from 'react-native';
import Header from '../../components/Header';
import styles from './style'

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'jshi18',
      password: '5630621274Sjh$',
    };
  }

  componentWillReceiveProps(nextProps) {
    // const { account } = nextProps;
    // this.state = Object.assign(this.state, {
    //   password: '',
    // });
  }

  shouldComponentUpdate(nextProps) {
    const { account } = nextProps;

    if (account.authenticated === true) {
      Actions.home();
      return false;
    }
    return true;
  }

  handleLogin() {
    const { accountAction } = this.props;
    accountAction.login(this.state.username, this.state.password);
  }

  render() {
    const { account } = this.props;
    const self = this;

    let loginButton;
    if (account.loading) {
      loginButton = (
        <TouchableOpacity
          onPress={ ()=>{}}
          style={ styles.button }
        >
          <View 
            style = { styles.button }
            >
               <ActivityIndicator
                animating={true}
                size="large"
              />
          </View>
       
        </TouchableOpacity>);
    } else {
      loginButton = (
        <TouchableOpacity
          onPress={ this.handleLogin.bind(self) }
        >
          <View 
            style = { styles.button }
            >
            <Text style={styles.buttonText}>Sign In</Text>
          </View>
            
        </TouchableOpacity>);
    }
    return (
      <View style={styles.container}>
        <Header/>
        <View style={styles.body}>
          <View style = {styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.blackFont]}
                placeholder="Username"
                placeholderTextColor="gray"
                onChangeText={(text) => this.setState({username:text})}
                value={this.state.username}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.blackFont]}
                placeholder="Password"
                placeholderTextColor="gray"
                onChangeText={(text) => this.setState({password:text})}
                secureTextEntry = {true}
                value={this.state.password}
              />
            </View>
          </View>
        </View>
        <View style = { styles.bottom }>
          <Text style = { styles.errorMessage }>{ account.error }</Text>
          {loginButton}
        </View>
      </View>
    );
  }
}

LoginScreen.propTypes = {
  account: PropTypes.object,
  accountAction: PropTypes.object,
};



export default LoginScreen;
