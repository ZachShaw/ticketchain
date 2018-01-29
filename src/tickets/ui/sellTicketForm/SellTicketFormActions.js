import TicketExchangeContract from '../../../../build/contracts/TicketExchange.json'
import store from '../../../store'
import { fetchTickets } from '../ticketList/TicketListActions';

const contract = require('truffle-contract')

export const TICKETS_UPDATED = 'TICKETS_UPDATED';

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
