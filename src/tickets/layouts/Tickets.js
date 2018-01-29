import React, { Component } from 'react';
import SellTicketFormContainer from '../ui/sellTicketForm/SellTicketFormContainer';
import TicketListContainer from '../ui/ticketList/TicketListContainer'

class Tickets extends Component {
  constructor(props, { authData }) {
    super(props);
    authData = this.props;
  }

  render() {

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Tickets</h1>
            <br/>
            <SellTicketFormContainer/>
            <br/>
            <TicketListContainer/>
          </div>
        </div>
      </main>
    )
  }
}

export default Tickets;