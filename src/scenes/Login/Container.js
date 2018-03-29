import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import AccountActionCreators from "../../actions/account";

import LoginScreen from "./Component";

function mapDispatchToProps(dispatch) {
  return {
    accountAction: bindActionCreators(AccountActionCreators, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    account: state.account
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
