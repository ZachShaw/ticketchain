import { connect } from 'react-redux';
import SellTicketForm from './SellTicketForm';
import { sellTicket } from './SellTicketFormActions'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSellTicketSubmit: (eventName, location, price) => {
      dispatch(sellTicket(eventName, location, price))
    }
  }
}

const SellTicketFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SellTicketForm)

export default SellTicketFormContainer;
