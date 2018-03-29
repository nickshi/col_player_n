import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(210, 206, 202, 0.5)',
    },
    currentTime: {
      flex: 2,
      color: 'black',
      backgroundColor: 'transparent',
    },
    durationTime: {
      flex: 3,
      color: 'black',
      backgroundColor: 'transparent',
    },
    progressView: {
      flex: 6,
    },
  });

  export default styles;