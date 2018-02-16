import { connect } from 'react-redux';
import ManageTickets from './ManageTickets';
// import { buyTicket } from '../../../redux/ticket.js';

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  // onBuyTicket: (ticketId, price) => dispatch(buyTicket(ticketId, price)),
});

const ManageTicketContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageTickets)

export default ManageTicketContainer;
