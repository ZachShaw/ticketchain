import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { WEB3_INITIALIZED } from '../../redux/web3';
import { usersTickets } from '../../redux/ticket.js';
import Tabs from '../../components/Tabs';
import TabPanel from '../../components/TabPanel';
import ManageTickets from '../components/managetickets/ManageTicketsContainer'

class Manage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredTickets: []
    }

    this.tabItems = ['selling', 'bought']
  }
  componentDidMount() {
    this.props.fetchUsersTickets();
  }

  componentWillReceiveProps(nextProps) {
    const { web3loading, fetchUsersTickets } = this.props;
    if (web3loading !== nextProps.web3loading) {
      fetchUsersTickets();
    }
  }

  render() {
    const { usersTickets } = this.props;
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h2>Manage Your Tickets</h2>
            <Tabs>
              {this.tabItems.map((item) => {
                return (
                  <TabPanel key={item} title={item}>
                    <ManageTickets type={item} usersTickets={usersTickets}/>
                  </TabPanel>
                )
              })}
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