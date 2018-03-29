
import { connect } from 'react-redux';
import WhiteBoard from './Component';
import * as actions from '../../../../actions/whiteboard';
function mapStateToProps(state, ownProps) {
  return {
    whiteboard: state[ownProps.boardname],
  };
}

export default connect(mapStateToProps, actions)(WhiteBoard);