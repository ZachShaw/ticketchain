import React, { Component } from 'react';

class SellTicketForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventName: '',
      location: '',
      price: ''
    }

    this.onChangeField = this.onChangeField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChangeField = (fieldName) => (e) => this.setState({[fieldName]: e.target.value});

  handleSubmit(event) {
    const { eventName, location, price } = this.state;
    event.preventDefault()

    if (eventName.length < 2) {
      return alert('Please fill in your name.')
    }

    if (location.length < 2) {
      return alert('Please fill in your email.')
    }

    if (price <= 0) {
      return alert('Please enter a price greather than zero.')
    }

    this.props.onSellTicketSubmit(eventName, location, price)
  }

  render() {
    return (
      <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
        <fieldset>
          <label>
            <label htmlFor="name">Event</label>
            <input id="event" type="text" value={this.state.name} onChange={this.onChangeField('eventName')} placeholder="Event name" />
            <label htmlFor="location">Location</label>
            <input id="location" type="text" value={this.state.name} onChange={this.onChangeField('location')} placeholder="Event location" />
            <label htmlFor="price">Sell For (Ether)</label>
            <input id="price" type="text" value={this.state.name} onChange={this.onChangeField('price')} placeholder="Price" />
          </label>
        </fieldset>
        <br />
        <button type="submit" className="pure-button pure-button-primary">Sell Ticket</button>
      </form>
    )
  }
}

export default SellTicketForm;