import { connect } from 'react-redux';
import ManageTickets from './ManageTickets';
import { userSellingTickets, userBoughtTickets } from '../../../selectors/ticketSelectors';
// import { buyTicket } from '../../../redux/ticket.js';

const mapStateToProps = (state) => {
  return {
    sellingTickets: userSellingTickets(state),
    boughtTickets: userBoughtTickets(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  // onBuyTicket: (ticketId, price) => dispatch(buyTicket(ticketId, price)),
});

const ManageTicketContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageTickets)

export default ManageTicketContainer;
