import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    TouchableHighlight,
    StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import styles from './style';
  
export default class Header extends Component {
    static propTypes = {
        //isLogged: PropTypes.bool.require,
    }
    render() {
        const { isLogged, onLogout } = this.props;
        return (
            <View style={styles.header}>
                <Image source={require('../../images/logo_depaul198.png')} />
                <Image source={require('../../images/logo_cdm264.png')} />
                {isLogged && (
                <TouchableHighlight onPress = { () => onLogout() } style = {styles.logoutBtn}>
                    <Text>Log Out</Text>
                </TouchableHighlight>)}
                
            </View>
        );
    }
}