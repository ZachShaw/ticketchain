import TicketExchangeContract from '../../../../build/contracts/TicketExchange.json'
import store from '../../../store'

const contract = require('truffle-contract')

export function sellTicket(eventName, location, price) {
  let web3 = store.getState().web3.web3Instance
  let eventId = 'EV001';
  let _price = web3.toWei(price, "ether");

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {
      // Using truffle-contract we create the authentication object.
      const ticketExchange = contract(TicketExchangeContract)
      ticketExchange.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on Authentication.
      var ticketExchangeInstance

      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        ticketExchange.deployed().then(function(instance) {
          ticketExchangeInstance = instance

          // Attempt to sign up user.
          ticketExchangeInstance.sellTicket(eventId, eventName, location, _price, {from: coinbase})
          .then(function(result) {
            // If no error, login user.
            // return dispatch(fetchTickets())
            console.log(result);
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
