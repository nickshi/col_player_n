import React from 'react';
import {
    View,
    ActivityIndicator
} from 'react-native';
import styles from './style';

export default () => (
<View style={styles.container}>
    <ActivityIndicator animating={true} size="large"/>
</View>
)