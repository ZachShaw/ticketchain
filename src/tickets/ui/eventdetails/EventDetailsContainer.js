import { connect } from 'react-redux';
import EventDetails from './EventDetails';
import { sellTicket } from '../../../redux/tickets.js';


const mapStateToProps = (state, ownProps) => {
  return {}
}


const mapDispatchToProps = (dispatch) => ({
  onSellTicket: (eventId, eventName, price) => dispatch(sellTicket(eventId, eventName, price)),
});

const EventDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EventDetails);

export default EventDetailsContainer;
