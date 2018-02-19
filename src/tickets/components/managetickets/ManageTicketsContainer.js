import { connect } from 'react-redux';
import ManageTickets from './ManageTickets';
import { 
  userSellingTickets, 
  userBoughtTickets, 
  userSoldTickets, 
  userRefundedTickets, 
  userCompleteTickets,
  userCancelledTickets,
} from '../../../selectors/ticketSelectors';
import { confirmTicket, refundTicket } from '../../../redux/ticket';
// import { buyTicket } from '../../../redux/ticket.js';

const mapStateToProps = (state) => {
  return {
    sellingTickets: userSellingTickets(state),
    boughtTickets: userBoughtTickets(state),
    soldTickets: userSoldTickets(state),
    refundedTickets: userRefundedTickets(state),
    completeTickets: userCompleteTickets(state),
    cancelledTickets: userCancelledTickets(state)
  };
};

const mapDispatchToProps = (dispatch) => ({
  onConfirmTicket: (ticketId) => dispatch(confirmTicket(ticketId)),
  onRefundTicket: (ticketId) => dispatch(refundTicket(ticketId)),
});

const ManageTicketContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageTickets)

export default ManageTicketContainer;
