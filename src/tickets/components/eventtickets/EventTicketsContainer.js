import { connect } from 'react-redux';
import EventTickets from './EventTickets';
import { buyTicket } from '../../../redux/ticket.js';


const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.data,
  }
}


const mapDispatchToProps = (dispatch) => ({
  onBuyTicket: (ticketId, price) => dispatch(buyTicket(ticketId, price)),
});

const EventTicketsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EventTickets);

export default EventTicketsContainer;
