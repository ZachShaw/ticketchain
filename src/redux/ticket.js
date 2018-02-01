import { handleActions } from 'redux-actions';
import { fetchActions, fetchSuccess } from './utils.js';
import store from '../store'
import TicketExchangeContract from '../../build/contracts/TicketExchange.json'

const contract = require('truffle-contract')

// export const SELL_TICKET = 'ticketchain/ticket/sell-ticket';
// const sellTicketActions = fetchActions(SELL_TICKET);
export const FETCH_TICKETS = 'ticketchain/ticket/fetch-tickets';
const fetchTicketActions = fetchActions(FETCH_TICKETS);
// export const BUY_TICKET = 'ticketchain/ticket/buy-ticket';
// const buyTicketActions = fetchActions(BUY_TICKET);


export function sellTicket(eventName, location, price) {
  let web3 = store.getState().web3.web3Instance
  let eventId = 'EV001';
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

          ticketExchangeInstance.sellTicket(eventId, eventName, location, _price, {from: coinbase})
          .then(function(result) {
            return dispatch(fetchTickets())
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

export function fetchTickets() {
  console.log('FIRING FROM FETCH TICKETS')
  let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {
    return function(dispatch) {

      dispatch(fetchTicketActions.started());
      const ticketExchange = contract(TicketExchangeContract)
      ticketExchange.setProvider(web3.currentProvider)

      var ticketExchangeInstance

      ticketExchange.deployed().then((instance) => {
      ticketExchangeInstance = instance;
      
      return ticketExchangeInstance.getTicketsForSale();
      }).then((ticketIds) => {
        var ticketsForSale = [];
        ticketIds.forEach((id, i) => {
          var ticketId = id.toNumber();
          ticketExchangeInstance.tickets(ticketId)
          .then((ticket) => {
            var ticketObj = {
              ticketId: ticket[0].toNumber(),
              seller: ticket[1],
              buyer: ticket[2],
              eventId: ticket[3],
              eventName: ticket[4],
              location: ticket[5],
              price: web3.fromWei(ticket[6].toNumber())
            }
            ticketsForSale.push(ticketObj);
            if (i === ticketIds.length - 1) {
              dispatch(fetchTicketActions.success(ticketsForSale))
            }
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

