import React, { Component } from 'react';

class TicketList extends Component {
  constructor(props) {
    super(props);

    this.state = {}
    this.createTicketListings = this.createTicketListings.bind(this);
  }

  componentDidMount() {
    this.props.onFetchTickets();
  }

  createTicketListings() {
    const { tickets, onBuyTicket } = this.props;

    return tickets.map((ticket) => {

      return (
        <li key={ticket.ticketId}>
          <p>{ticket.seller}</p>
          <p>{ticket.eventId}</p>
          <p>{ticket.eventName}</p>
          <p>{ticket.location}</p>
          <p>{ticket.price}ETH</p>
          <button 
            className="pure-button pure-button-primary" 
            onClick={() => onBuyTicket(ticket.ticketId, ticket.price)}
          >
            Buy Ticket
          </button>
        </li>
      );
    })
  }

  render() {

    const { tickets } = this.props;

    if (!tickets) return null;

    return (
      <div className="">
        <h3>Available Tickets</h3>
        <ul>
          {this.createTicketListings()}
        </ul>
      </div>
    )
  }
}

export default TicketList;