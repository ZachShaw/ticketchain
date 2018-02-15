import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import SellTicketFormContainer from '../ui/sellticketform/SellTicketFormContainer';
import EventDetailsContainer from '../ui/eventdetails/EventDetailsContainer';
// import TicketListContainer from '../ui/ticketlist/TicketListContainer';
import SearchEvents from '../ui/searchevents/SearchEventsContainer';
import { fetchTickets } from '../../redux/ticket.js';
import { WEB3_INITIALIZED } from '../../redux/web3';

class Tickets extends Component {

  componentDidMount() {
    this.props.onFetchTickets(0);
  }

  componentWillReceiveProps(nextProps) {
    const { web3loading, onFetchTickets } = this.props;
    if (web3loading !== nextProps.web3loading) {
      onFetchTickets(0);
    }
  }

  render() {
    const { events, selectedEvent, created } = this.props;

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            {/* <SellTicketFormContainer/> */}
            <SearchEvents events={events} />            
            <EventDetailsContainer event={selectedEvent} createdTickets={created}/>
            {/*<TicketListContainer { ...this.props }/>*/}
          </div>
        </div>
      </main>
    )
  }
}

const mapStateToProps = (state) => {
  let web3loading = state.network.loading[WEB3_INITIALIZED];

  return {
      web3loading, 
      created: state.ticket.status.created,
      user: state.user.data,
      events: state.events.data,
      selectedEvent: state.events.selected,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onFetchTickets: (status) => dispatch(fetchTickets(status))
});

Tickets.PropTypes = {
  onFetchTickets: PropTypes.func,
  events: PropTypes.object,
  user: PropTypes.object,
  created: PropTypes.array,
  web3loading: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tickets);