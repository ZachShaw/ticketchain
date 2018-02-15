import { handleActions } from 'redux-actions';
import { fetchActions, fetchSuccess } from './utils.js';
// import { fetchUser } from './user.js';
import { fetchUser } from '../util/user/userUtils.js';
import store from '../store'
import TicketExchangeContract from '../../build/contracts/TicketExchange.json'

const contract = require('truffle-contract')
export const FETCH_TICKETS = 'ticketchain/ticket/fetch-tickets';
const fetchTicketActions = fetchActions(FETCH_TICKETS);


export function sellTicket(eventId, eventName, price) {
  let web3 = store.getState().web3.web3Instance
  let _price = web3.toWei(price, "ether");

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {
      const ticketExchange = contract(TicketExchangeContract)
      ticketExchange.setProvider(web3.currentProvider)

      var ticketExchangeInstance

      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        if (error) {
          console.error(error);
        }

        ticketExchange.deployed().then(function(instance) {
          ticketExchangeInstance = instance

          ticketExchangeInstance.sellTicket(eventId, eventName, _price, {from: coinbase})
          .then(function(result) {
            return dispatch(fetchTickets(0))
          })
          .catch(function(result) {
            // If error...
          })
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.');
  }
}

// status 0: Created, 1: Locked, 2: Complete, 3: Refunded, 4: Cancelled
export function fetchTickets(status) {
  let web3 = store.getState().web3.web3Instance
  if (typeof web3 !== 'undefined') {
    return function(dispatch) {

      dispatch(fetchTicketActions.started());
      const ticketExchange = contract(TicketExchangeContract)
      ticketExchange.setProvider(web3.currentProvider)

      var ticketExchangeInstance

      ticketExchange.deployed().then((instance) => {
      ticketExchangeInstance = instance;
      
      return ticketExchangeInstance.getTicketsByStatus(status);
      }).then((ticketIds) => {
        var ticketsArr = [];
        ticketIds.forEach((id, i) => {
          var ticketId = id.toNumber();
          ticketExchangeInstance.tickets(ticketId)
          .then((ticket) => {
            let user;
            fetchUser(ticket[1]).then((r) => user = r).finally(() => {
              var ticketObj = {
                ticketId: ticket[0].toNumber(),
                seller: ticket[1],
                user,
                buyer: ticket[2],
                eventId: ticket[3],
                eventName: ticket[4],
                price: web3.fromWei(ticket[5].toNumber())
              }
              ticketsArr.push(ticketObj);
              if (i === ticketIds.length - 1) {
                dispatch(fetchTicketActions.success(ticketsArr))
              }
            });
          })
        })
      }).catch((error) => {
        console.log(error);
      })
    }
  }
}

export function buyTicket(ticketId, price) {
  let web3 = store.getState().web3.web3Instance

  if (typeof web3 !== 'undefined') {
    return function(dispatch) {
      const ticketExchange = contract(TicketExchangeContract)
      ticketExchange.setProvider(web3.currentProvider)

      var ticketExchangeInstance

      ticketExchange.deployed()
      .then((instance) => {
        ticketExchangeInstance = instance;

        web3.eth.getCoinbase((error, coinbase) => {
          if (error) {
            console.error(error);
          }

          return ticketExchangeInstance.buyTicket(ticketId, {
            from: coinbase,
            value: web3.toWei(price, "ether"),
            gas: 500000
          })
        })
      }).then(() => {
        dispatch(fetchTickets());
      })
    }
  }
} 

const initialState = {
  data: []
}

export default handleActions({
  [fetchSuccess(FETCH_TICKETS)]: (state, action) => {
      return {
          ...state,
          data: action.payload
      };
  }
}, initialState);

