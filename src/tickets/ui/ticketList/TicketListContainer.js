import { connect } from 'react-redux';
import TicketList from './TicketList';
import { fetchTickets, buyTicket } from './TicketListActions'

const mapStateToProps = (state, ownProps) => {
  return {
    tickets: state.ticket.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchTickets: () => { dispatch(fetchTickets()) },
    onBuyTicket: (ticketId, price) => { dispatch(buyTicket(ticketId, price)) }
  }
}

const TicketListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TicketList)

export default TicketListContainer;
