import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import SellTicketFormContainer from '../ui/sellticketform/SellTicketFormContainer';
import TicketListContainer from '../ui/ticketlist/TicketListContainer';
import SearchEvents from '../ui/searchevents/SearchEventsContainer';
import { fetchTickets } from '../../redux/ticket.js';
import { WEB3_INITIALIZED } from '../../redux/web3';

class Tickets extends Component {
  constructor(props, { authData }) {
    super(props);
    authData = this.props;
  }

  componentWillReceiveProps(nextProps) {
    const { web3loading, onFetchTickets, tickets } = this.props;
    if (web3loading !== nextProps.web3loading || !tickets) {
      onFetchTickets();
    }
  }

  render() {
    const { events } = this.props;

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            {/* <SellTicketFormContainer/> */}
            <SearchEvents events={events} />
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