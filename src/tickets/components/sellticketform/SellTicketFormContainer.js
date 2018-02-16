import { connect } from 'react-redux';
import SellTicketForm from './SellTicketForm';
import { sellTicket } from '../../../redux/ticket.js'


const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => ({
  onSellTicket: (eventName, location, price) => dispatch(sellTicket(eventName, location, price))
});

const SellTicketFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SellTicketForm)

export default SellTicketFormContainer;
