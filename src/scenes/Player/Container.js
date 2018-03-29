import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as pActions from '../../actions/player';
import * as oScreenActions from '../../actions/screen';
import * as lScreenActions from '../../actions/localScreen';


import PlayerScreen from './Component';
function mapStateToProps(state) {
    return {
      player: state.player,
      lecture: state.lecture,
      layout: state.layout,
    };
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      playerActions: bindActionCreators(pActions, dispatch),
      onlineScreenActions: bindActionCreators(oScreenActions, dispatch),
      localScreenActions: bindActionCreators(lScreenActions, dispatch),
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(PlayerScreen);