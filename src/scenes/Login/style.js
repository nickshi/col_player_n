import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: 'white',
    },
  
    header: {
      flexDirection: 'row',
      alignItems:'center',
      height: 60,
      backgroundColor: 'rgb(114, 34, 38)',
    },
  
    mpaaText: {
      fontFamily: 'Palatino',
      fontSize: 35,
      fontWeight: '500',
      color: 'black',
    },
  
    body: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems:'center',
      flex: 0.8,
    },
  
    form: {
      height: 80,
      width: 300,
    },
  
    input: {
      position: 'absolute',
      left: 15,
      top: 12,
      right: 0,
      height: 40,
      fontSize: 14,
    },
  
    inputContainer: {
      width: 300,
      height: 40,
      borderWidth: 1,
      borderBottomColor: '#CCC',
      borderColor: 'transparent',
    },
  
    blackFont: {
      color: '#000',
    },
  
    bottom: {
      flex: 0.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    errorMessage: {
      color: 'red',
      marginBottom: 20,
    },
  
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 300,
      padding: 10,
      height: 45,
      borderRadius: 4,
      backgroundColor: 'rgb(114, 34, 38)',
    },
  
    buttonText: {
      fontSize: 20,
      textAlign: 'center',
      color: 'white'
    }
  
  });

  export default styles;