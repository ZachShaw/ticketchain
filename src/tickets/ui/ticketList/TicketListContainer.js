import { connect } from 'react-redux';
import TicketList from './TicketList';
import { fetchTickets, buyTicket } from '../../../redux/ticket.js';
import { fetchUser } from '../../../redux/user.js';
import { WEB3_INITIALIZED } from '../../../redux/web3';

const mapStateToProps = (state) => {
  let web3loading = state.network.loading[WEB3_INITIALIZED];

  return {
      web3loading, 
      tickets: state.ticket.data,
      user: state.user.data,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onFetchTickets: () => dispatch(fetchTickets()),
  onBuyTicket: (ticketId, price) => dispatch(buyTicket(ticketId, price)),
  onFetchUser: (address) => dispatch(fetchUser(address))
});

const TicketListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TicketList)

export default TicketListContainer;
