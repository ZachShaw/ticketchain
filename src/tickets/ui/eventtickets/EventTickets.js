import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './EventTickets.css';

class EventDetails extends Component {

  render() {
    const { tickets, user, onBuyTicket } = this.props;
    if (tickets.length === 0) return null;

    return (
      <div className="event-tickets--container">
        <h2>Available</h2>
        <ul>
        {tickets && tickets.map((ticket) => {
          return (
            <li key={ticket.ticketId} className="event-tickets--item">
              <div className="event-tickets--event-name flex-left">
                <p>1 x {ticket.eventName}</p>
              </div>
              <div className="event-tickets--ticket-price flex-center">
                <p>Ξ{ticket.price} / ticket</p>
              </div>
              <div className="event-tickets--seller">
                <h4 className="ticketlist--seller">{ticket.user.username}</h4>
                <h5 className="ticketlist--wallet">{ticket.seller}</h5>
              </div>
              <div className="event-tickets--btn-cell flex-right">
                {ticket.user.username !== user.username ? <button 
                  className="pure-button pure-button-primary event-tickets--btn" 
                  onClick={() => onBuyTicket(ticket.ticketId, ticket.price)}
                >
                  Buy Ticket
                </button> : <div className="pure-button event-tickets--btn">Remove Listing</div>
                }
              </div>
            </li>
          )
        })}
        </ul>
      </div>
    )
  }
}

EventDetails.PropTypes = {
  tickets: PropTypes.array,
}

export default EventDetails;