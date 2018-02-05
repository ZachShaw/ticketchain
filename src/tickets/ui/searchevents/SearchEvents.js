import React, { Component } from 'react';
import './SearchEvents.css';

class SearchEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
    }

    this.onChangeField = this.onChangeField.bind(this);
  }

  onChangeField = (fieldName) => (e) => this.setState({[fieldName]: e.target.value});

  render() {
    const { searchTerm } = this.state;
    const { events } = this.props;
    const { results } = events;

    return (
      <div className="search--container">
        <h2>Search for event</h2>
        <div className="searchbar--wrapper">
          <input className="searchbar--input" onChange={this.onChangeField('searchTerm')} placeholder="Artists, events.."/>
          <button 
            type="button" 
            className="pure-button pure-button-primary searchbar--btn" 
            onClick={() => this.props.onSearchEvents(searchTerm)}
          >
            Search
          </button>
        </div>
        <ul className="search--results">
          {results && results.map((result) => 
            <li key={result.id} className="search--results--event">
              <div className="search--results--left">
                <img 
                  alt="event-img" 
                  src={result.largeimageurl}
                  className="search--results--img"
                />
                <div className="search--results--date">
                  <h5>{result.date}</h5>
                </div>
              </div>
              <div className="search--results--info">
                <h3 style={{margin: '0'}}>{result.eventname}</h3>
                
                <p>{result.venue.address}</p>
                <span>TICKETS AVAILABLE!</span>
                <button className="pure-button pure-button-primary search--results--btn">View Event</button>
              </div>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default SearchEvents;