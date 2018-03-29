

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as playerActions from '../../../../actions/player';
import PlayerBar from './Component';

function mapStateToProps(state) {
  return {
    player: state.player,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    playerActions: bindActionCreators(playerActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlayerBar);