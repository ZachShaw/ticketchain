import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ManageTickets.css';
import { convertStatus } from '../../../util/tickets/enumStatus.js';

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
        <div className="pure-button event-tickets--btn">Remove Listing</div>
      )
    }
  }

  createTicketList() {
    // MOVE ALL OF THIS INTO REDUX
    const { usersTickets, type } = this.props;
    const filteredTickets = usersTickets.filter((ticket) => {
      if (type === 'selling') {
        return ticket.status === convertStatus(type)
      } else if (type === 'bought') {
        return ticket.status === convertStatus(type) && ticket.user.username !== 'zshaw'
      }
      return [];
    });

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