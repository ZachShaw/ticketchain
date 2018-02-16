import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './EventDetails.css';
import EventTicketsContainer from '../eventtickets/EventTicketsContainer';

class EventDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      toggleSellPrice: false,
      price: '',
      ticketsAvailable: [],
    }

    this.onToggleSellPrice = this.onToggleSellPrice.bind(this);
    this.onChangeField = this.onChangeField.bind(this);
    this.checkAvailableTickets = this.checkAvailableTickets.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { createdTickets, event } = nextProps;
    event && this.checkAvailableTickets(createdTickets, event);
    this.setState({ toggleSellPrice: false });
  }

  onToggleSellPrice() {
    const { toggleSellPrice } = this.state;
    this.setState({
      toggleSellPrice: !toggleSellPrice
    })
  }

  onChangeField = (fieldName) => (e) => this.setState({[fieldName]: e.target.value});

  checkAvailableTickets(tickets, event) {
    this.setState({ ticketsAvailable: [] });
    let eventTickets = [];
    tickets.length > 0 && tickets.forEach((ticket) => {
      if (ticket.eventId === event.id) {
        eventTickets.push(ticket);
      }
    })
    if (eventTickets.length) {
      this.setState((state, props) => { return { ticketsAvailable: eventTickets }
      })
    }
  }

  render() {
    const { event, onSellTicket } = this.props;
    const { toggleSellPrice, price, ticketsAvailable } = this.state;

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
          <div className="event--tickets-info">
            <div className="event--availability">
              <span>{this.state.ticketsAvailable.length}</span>
              <p>Available</p>
            </div>
            { toggleSellPrice ?
              <div className="event--sell">
                <input id="price" type="text" value={this.state.price} 
                  onChange={this.onChangeField('price')} placeholder="Sell For (Ether)" 
                />
                <button 
                  type="button" 
                  className="pure-button pure-button-primary event--sell-btn" 
                  onClick={() => onSellTicket(event.id, event.eventname, price)}
                >
                  Sell
              </button>
              <button 
                  type="button" 
                  className="pure-button event--sell-btn" 
                  onClick={() => this.onToggleSellPrice()}
                >
                  Cancel
              </button>
              </div> : <button 
              type="button" 
              className="pure-button pure-button-primary event--sell-btn" 
              onClick={() => this.onToggleSellPrice()}
            >
              I want to sell a ticket
            </button>
            }
          </div>
        </div>
        <EventTicketsContainer tickets={ticketsAvailable} />
      </div>
    )
  }
}

EventDetails.PropTypes = {
  event: PropTypes.object.isRequired,
  onSellTicket: PropTypes.func,
  createdTickets: PropTypes.array,
}

export default EventDetails;