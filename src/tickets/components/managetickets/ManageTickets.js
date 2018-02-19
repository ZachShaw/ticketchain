import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ManageTickets.css';

class ManageTickets extends Component {
  constructor(props) {
    super(props);
    
    this.state = {}
    this.createTicketList = this.createTicketList.bind(this);
    this.addButtons = this.addButtons.bind(this);
  }

  addButtons() {
    const { type } = this.props;
    switch(type) {
      default: return (
        <button className="pure-button event-tickets--btn">Remove Listing</button>
      )
      case 'bought': return (
        <div className="ticketlist--btn-wrapper">
          <button className="pure-button event-tickets--btn">Confirm</button>
          <button className="pure-button event-tickets--btn">Request Refund</button>
        </div>
      )
      case 'sold': return (
        <div className="ticketlist--btn-wrapper">
          <button className="pure-button event-tickets--btn">Issue Refund</button>
        </div>
      )
    }
  }

  createTicketList() {
    const { sellingTickets, boughtTickets, soldTickets, type } = this.props;
    const filteredTickets = (() => {
      switch(type) {
        default: return sellingTickets;
        case 'bought': return boughtTickets;
        case 'sold': return soldTickets;
      }
    })(type);

    return filteredTickets.length ? filteredTickets.map((ticket) => {
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
            {this.addButtons()}
          </div>
        </li>
      )
    }) : null
  }

  render() {
    return (
      <ul className="ticketlist--wrapper">
        {this.createTicketList()}
      </ul>
    )
  }
}

ManageTickets.PropTypes = {
  type: PropTypes.string,
  usersTickets: PropTypes.array,
}

export default ManageTickets;