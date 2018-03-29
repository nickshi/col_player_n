
import { connect } from 'react-redux';
import LocalScreenShot from './Component';

function mapStateToProps(state) {
  return {
    screen: state.localScreen,
  };
}
export default connect(mapStateToProps)(LocalScreenShot);