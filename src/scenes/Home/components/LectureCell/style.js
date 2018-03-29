import {
    StyleSheet,
  } from 'react-native';

  const styles = StyleSheet.create({
    thumb: {
      width: 80,
      height: 80,
      marginRight: 10,
    },
    textContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
  
    },
    separator: {
      height: 1,
      backgroundColor: '#dddddd',
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      color: '#000',
    },
    detail: {
      fontSize: 14,
      color: '#656565',
    },
    rowContainer: {
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
    },
    deleteButton: {
  
    },
  
    rightDownloadedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rightButton: {
      width: 30,
      height: 30,
      marginRight: 20,
    },
  });

  export default styles;