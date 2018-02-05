import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import SellTicketFormContainer from '../ui/sellticketform/SellTicketFormContainer';
import EventDetailsContainer from '../ui/eventdetails/EventDetailsContainer';
import TicketListContainer from '../ui/ticketlist/TicketListContainer';
import SearchEvents from '../ui/searchevents/SearchEventsContainer';
import { fetchTickets } from '../../redux/ticket.js';
import { WEB3_INITIALIZED } from '../../redux/web3';

class Tickets extends Component {
  constructor(props, { authData }) {
    super(props);
    authData = this.props;
  }

  componentDidMount() {
    this.props.onFetchTickets();
  }

  componentWillReceiveProps(nextProps) {
    const { web3loading, onFetchTickets, tickets } = this.props;
    if (web3loading !== nextProps.web3loading || !tickets.length) {
      onFetchTickets();
    }
  }

  render() {
    const { events, selectedEvent, tickets } = this.props;

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            {/* <SellTicketFormContainer/> */}
            <SearchEvents events={events} />            
            <EventDetailsContainer event={selectedEvent} tickets={tickets}/>
            <TicketListContainer { ...this.props }/>
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
      tickets: state.ticket.data,
      user: state.user.data,
      events: state.events.data,
      selectedEvent: state.events.selected,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onFetchTickets: () => dispatch(fetchTickets())
});

Tickets.PropTypes = {
  onFetchTickets: PropTypes.func,
  events: PropTypes.object,
  user: PropTypes.object,
  tickets: PropTypes.array,
  web3loading: PropTypes.bool,
}

export default connect(mapStateToProps, mapDispatchToProps)(Tickets);