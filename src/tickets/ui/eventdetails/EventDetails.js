import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'EventDetails.css';

class EventDetails extends Component {
  constructor(props) {
    super(props);
    console.log('HELLO FROM EVENT DETAILS!!');
  }

  render() {
    const { event } = this.props;
    return (
      <div className="event--container">
        <h3>{event.eventname}</h3>
        <p>{event.description}</p>
        <img 
          alt="event-img" 
          src={event.largeimageurl}
        />
      </div>
    )
  }
}

EventDetails.PropTypes = {
  event: PropTypes.object.isRequired,
  onSellTicket: PropTypes.func
}

export default EventDetails;