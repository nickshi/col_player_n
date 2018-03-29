
import { connect } from 'react-redux';
import ScreenShot from './Component';

function mapStateToProps(state) {
    return {
      screen: state.screen,
    };
  }
export default connect(mapStateToProps)(ScreenShot);