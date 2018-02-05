import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './EventDetails.css';

class EventDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      toggleSellPrice: false,
      price: '',
      ticketsAvailable: 0,
    }

    this.onToggleSellPrice = this.onToggleSellPrice.bind(this);
    this.onChangeField = this.onChangeField.bind(this);
    this.checkAvailableTickets = this.checkAvailableTickets.bind(this);
  }

  componentWillReceiveProps() {
    this.checkAvailableTickets();
  }

  onToggleSellPrice() {
    const { toggleSellPrice } = this.state;
    this.setState({
      toggleSellPrice: !toggleSellPrice
    })
  }

  onChangeField = (fieldName) => (e) => this.setState({[fieldName]: e.target.value});

  checkAvailableTickets() {
    const { tickets, event } = this.props;

    tickets.length && this.state.ticketsAvailable === 0 && tickets.forEach((ticket) => {
      if (ticket.eventId === event.id) {
        this.setState((state, props) => { return { ticketsAvailable: state.ticketsAvailable + 1 }})
      }
    })
  }

  render() {
    const { event, onSellTicket } = this.props;
    const { toggleSellPrice, price } = this.state;

    if (!event) return null;

    return (
      <div className="event--container">
        <div className="event--header">
          <img 
            alt="event-img" 
            src={event.largeimageurl}
          />
          <div className="event--header-info">
            <h1>{event.eventname}</h1>
            <span>{moment(event.startdate).format("MMMM Do YYYY")}</span>
            <span>{event.venue.name}, {event.venue.address}, {event.venue.country}</span>
            <div className="event--header-additional">
              <h4>Attending: {event.goingtocount}</h4>
              <h4>Type: {event.EventCode}</h4>
            </div>
          </div>
        </div>
        <div className="event--content">
          <h4>{event.description}</h4>
          <div className="event--tickets">
            <h2>Currently {this.state.ticketsAvailable} tickets available</h2>
            <button 
              type="button" 
              className="pure-button pure-button-primary event--sell-btn" 
              onClick={() => this.onToggleSellPrice()}
            >
              I want to list a ticket
            </button>
            { toggleSellPrice ?
              <div className="event--sell">
              <label htmlFor="price">Sell For (Ether)</label>
              <input id="price" type="text" value={this.state.price} 
                onChange={this.onChangeField('price')} placeholder="Price" 
              />
              <button 
                type="button" 
                className="pure-button pure-button-primary" 
                onClick={() => onSellTicket(event.id, event.eventname, price)}
              >
                Sell
            </button>
            </div> : null
            }
          </div>
        </div>
        <p></p>
      </div>
    )
  }
}

EventDetails.PropTypes = {
  event: PropTypes.object.isRequired,
  onSellTicket: PropTypes.func,
  tickets: PropTypes.array,
}

export default EventDetails;