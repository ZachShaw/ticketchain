import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { WEB3_INITIALIZED } from '../../redux/web3';
import { usersTickets } from '../../redux/ticket.js';
import Tabs from '../../components/Tabs';
import TabPanel from '../../components/TabPanel';

class Manage extends Component {

  componentDidMount() {
    this.props.fetchUsersTickets(0);
  }

  componentWillReceiveProps(nextProps) {
    const { web3loading, fetchUsersTickets } = this.props;
    if (web3loading !== nextProps.web3loading) {
      fetchUsersTickets(0);
    }
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h2>Manage Your Tickets</h2>
            <Tabs>
              <TabPanel title="Bought">
                <h3>BOUGHT</h3>
              </TabPanel>
              <TabPanel title="Selling">
                <h3>SELLING</h3>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </main>
    )
  }
}

const mapStateToProps = (state) => {
  let web3loading = state.network.loading[WEB3_INITIALIZED];

  return {
      web3loading, 
      usersTickets: state.ticket.user,
      user: state.user.data
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchUsersTickets: () => dispatch(usersTickets())
});

Manage.PropTypes = {
  fetchUsersTickets: PropTypes.func,
  usersTickets: PropTypes.array,
  user: PropTypes.object,
  web3loading: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(Manage);