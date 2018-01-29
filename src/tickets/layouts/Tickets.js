import React, { Component } from 'react';
import SellTicketFormContainer from '../ui/sellTicketForm/SellTicketFormContainer';

class Tickets extends Component {
  constructor(props, { authData }) {
    super(props);
    authData = this.props;
  }

  render() {
    const { authData } = this.props;

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Tickets</h1>
            <SellTicketFormContainer/>
          </div>
        </div>
      </main>
    )
  }
}

export default Tickets;