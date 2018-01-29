import React, { Component } from 'react';

class TicketList extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    this.props.onFetchTickets();
  }

  render() {

    const { tickets, onBuyTicket } = this.props;

    if (!tickets) return null;

    return (
      <div className="">
        <h3>Available Tickets</h3>
        <ul>
          {tickets && tickets.map((ticket) => {
            return (
              <li key={ticket.ticketId}>
                <p>{ticket.ticketId}</p>
                <p>{ticket.seller}</p>
                <p>{ticket.buyer}</p>
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
          })}
        </ul>
      </div>
    )
  }
}

export default TicketList;