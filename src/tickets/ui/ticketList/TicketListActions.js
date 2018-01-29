import TicketExchangeContract from '../../../../build/contracts/TicketExchange.json'
import store from '../../../store'

const contract = require('truffle-contract')

export const STORE_TICKETS = 'STORE_TICKETS';
function storeTickets(tickets) {
  return {
    type: STORE_TICKETS,
    payload: tickets
  }
}

export function fetchTickets() {
  let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {
    return function(dispatch) {

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
              dispatch(storeTickets(ticketsForSale))
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