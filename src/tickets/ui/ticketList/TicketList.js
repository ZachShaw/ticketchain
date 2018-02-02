import React, { Component } from 'react';
import './TicketList.css';

class TicketList extends Component {
  constructor(props) {
    super(props);
    
    this.state = {}
    this.createTicketListings = this.createTicketListings.bind(this);
  }

  createTicketListings() {
    const { tickets, onBuyTicket, user } = this.props;

    return tickets.map((ticket) => {
      return (
        <li key={ticket.ticketId} className="ticketlist--item">
          <img 
            alt="event-img" 
            src="https://cdn.ticketswap.com/public/201801/c6ac4a58-b883-4295-9cf5-d35a4e5731d2.jpeg" 
            className="ticketlist--img"
          />
          <h3>{ticket.eventName}</h3>
          <h4 className="ticketlist--seller">{ticket.user.username}</h4>
          <h5 className="ticketlist--wallet">{ticket.seller}</h5>
          <p>{ticket.location}</p>
          <h4>Ξ{ticket.price}</h4>
          {ticket.user.username !== user.username ? <button 
            className="pure-button pure-button-primary" 
            onClick={() => onBuyTicket(ticket.ticketId, ticket.price)}
          >
            Buy Ticket
          </button> : <h4>
            Your Listing
          </h4>}
        </li>
      );
    })
  }

  render() {

    const { tickets } = this.props;

    if (!tickets) return null;

    return (
      <div className="ticketlist--container">
        <h3>Available Tickets</h3>
        <ul className="ticketlist--wrapper">
          {this.createTicketListings()}
        </ul>
      </div>
    )
  }
}

export default TicketList;