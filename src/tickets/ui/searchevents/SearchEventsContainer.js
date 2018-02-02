import { connect } from 'react-redux';
import SearchEvents from './SearchEvents';
import { searchEvents } from '../../../redux/events.js';


const mapStateToProps = (state, ownProps) => {
  return {}
}


const mapDispatchToProps = (dispatch) => ({
  onSearchEvents: (searchTerm) => dispatch(searchEvents(searchTerm)),
});

const SearchEventsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchEvents);

export default SearchEventsContainer;
