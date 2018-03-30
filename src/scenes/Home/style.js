import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  
    section: {
      backgroundColor: 'gray',
    },
  
    header: {
      flexDirection: 'row',
      alignItems:'center',
      height: 60,
      backgroundColor: 'rgb(114, 34, 38)',
    },
  
    sectionHeader: {
      backgroundColor: 'gray'
    },
  
    sectionHeaderText: {
      fontFamily: 'AvenirNext-Medium',
      fontSize: 16,
      color: 'white',
      paddingLeft: 10
    },
  
  });

  export default styles;