import { connect } from 'react-redux';
import TicketList from './TicketList';
import { buyTicket } from '../../../redux/ticket.js';

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  onBuyTicket: (ticketId, price) => dispatch(buyTicket(ticketId, price)),
});

const TicketListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TicketList)

export default TicketListContainer;
