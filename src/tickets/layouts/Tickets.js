import React, { Component } from 'react';
import { connect } from 'react-redux';
import SellTicketFormContainer from '../ui/sellTicketForm/SellTicketFormContainer';
import TicketListContainer from '../ui/ticketList/TicketListContainer';
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

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Tickets</h1>
            <SellTicketFormContainer/>
            <br/>
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  onFetchTickets: () => dispatch(fetchTickets())
});

export default connect(mapStateToProps, mapDispatchToProps)(Tickets);