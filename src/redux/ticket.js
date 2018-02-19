import { handleActions } from 'redux-actions';
import { fetchActions, fetchSuccess } from './utils.js';
import { fetchUser } from '../util/user/userUtils.js';
import { getEnumStatus } from '../util/tickets/status.js';
import { createTicket } from '../util/tickets/format.js';
import store from '../store';
import TicketExchangeContract from '../../build/contracts/TicketExchange.json';

const contract = require('truffle-contract');

export const FETCH_TICKETS = 'ticketchain/ticket/fetch-tickets';
const fetchTicketActions = fetchActions(FETCH_TICKETS);
export const FETCH_USERS_TICKETS = 'ticketchain/ticket/fetch-users-tickets';
const fetchUsersTickets = fetchActions(FETCH_USERS_TICKETS);
export const SELL_TICKET = 'ticketchain/ticket/sell-ticket';
const sellTicketActions = fetchActions(SELL_TICKET);
export const CONFIRM_TICKET = 'ticketchain/ticket/confirm-ticket';
const confirmTicketActions = fetchActions(CONFIRM_TICKET);
export const CANCEL_TICKET = 'ticketchain/ticket/cancel-ticket';
const cancelTicketActions = fetchActions(CANCEL_TICKET);
export const REFUND_TICKET = 'ticketchain/ticket/refund-ticket';
const refundTicketActions = fetchActions(REFUND_TICKET);


export function sellTicket(eventId, eventName, price) {
  let web3 = store.getState().web3.web3Instance;
  let _price = web3.toWei(price, "ether");

  if (typeof web3 !== 'undefined') {
    return (dispatch) => {
      dispatch(sellTicketActions.started());
      const ticketExchange = contract(TicketExchangeContract);
      ticketExchange.setProvider(web3.currentProvider);

      var ticketExchangeInstance;

      web3.eth.getCoinbase((error, coinbase) => {
        if (error) console.error(error)
        ticketExchange.deployed().then((instance) => {
          ticketExchangeInstance = instance;
          ticketExchangeInstance.sellTicket(eventId, eventName, _price, {from: coinbase})
          .then(() => {
            dispatch(sellTicketActions.success());
          })
          .then(() => {
            return dispatch(fetchTickets(0));
          })
          .catch(() => {
          });
        });
      });
    };
  } else {
    console.error('Web3 is not initialized.');
  }
}

// status 0: Created, 1: Locked, 2: Complete, 3: Refunded, 4: Cancelled
export function fetchTickets(status) {
  let web3 = store.getState().web3.web3Instance;
  if (typeof web3 !== 'undefined') {
    return (dispatch) => {

      dispatch(fetchTicketActions.started());
      const ticketExchange = contract(TicketExchangeContract);
      ticketExchange.setProvider(web3.currentProvider);
      var ticketExchangeInstance;

      ticketExchange.deployed().then((instance) => {
      ticketExchangeInstance = instance;
      
      return ticketExchangeInstance.getTicketsByStatus(status);
      }).then((ticketIds) => {
        var ticketsArr = [];
        if (ticketIds.length) {
          ticketIds.forEach((id, i) => {
            var ticketId = id.toNumber();
            ticketExchangeInstance.tickets(ticketId)
            .then((ticket) => {
              let user;
              fetchUser(ticket[1]).then((r) => user = r).finally(() => {
                var ticketObj = createTicket(ticket, user)
                ticketsArr.push(ticketObj);
                if (i === ticketIds.length - 1) {
                  let res = { tickets: ticketsArr, status: getEnumStatus(ticket[6].toNumber())};
                  dispatch(fetchTicketActions.success(res));
                }
              });
            });
          });
        } else {
          dispatch(fetchTicketActions.success([]));
        }
      }).catch((error) => {
        console.log(error);
      });
    };
  }
}

export function usersTickets() {
  let web3 = store.getState().web3.web3Instance;
  if (typeof web3 !== 'undefined') {
    return (dispatch) => {

      dispatch(fetchUsersTickets.started());
      const ticketExchange = contract(TicketExchangeContract);
      ticketExchange.setProvider(web3.currentProvider);
      var ticketExchangeInstance;

      ticketExchange.deployed().then((instance) => {
        ticketExchangeInstance = instance;

        web3.eth.getCoinbase((error, coinbase) => {
          if (error) { console.error(error); }
          return ticketExchangeInstance.getTicketsByUser(coinbase)
          .then((ticketIds) => {
            var ticketsArr = [];
            if (ticketIds.length) {
              ticketIds.forEach((id, i) => {
                var ticketId = id.toNumber();
                ticketExchangeInstance.tickets(ticketId)
                .then((ticket) => {
                  let user;
                  fetchUser(ticket[1]).then((r) => user = r).finally(() => {
                    var ticketObj = createTicket(ticket, user);
                    ticketsArr.push(ticketObj);
                    if (i === ticketIds.length - 1) {
                      dispatch(fetchUsersTickets.success(ticketsArr));
                    }
                  });
                });
              });
            } else {
              dispatch(fetchUsersTickets.success([]));
            }
          }).catch((error) => {
            console.log(error);
          })
        })
      })
    }
  }
}

export function buyTicket(ticketId, price) {
  let web3 = store.getState().web3.web3Instance;
  if (typeof web3 !== 'undefined') {
    return (dispatch) => {
      const ticketExchange = contract(TicketExchangeContract);
      ticketExchange.setProvider(web3.currentProvider);
      var ticketExchangeInstance;

      ticketExchange.deployed()
      .then((instance) => {
        ticketExchangeInstance = instance;

        web3.eth.getCoinbase((error, coinbase) => {
          if (error) console.error(error)

          return ticketExchangeInstance.buyTicket(ticketId, {
            from: coinbase,
            value: web3.toWei(price, "ether"),
            gas: 500000
          });
        });
      }).then(() => {
        dispatch(fetchTickets(0));
      });
    };
  }
}

export function confirmTicket(ticketId) {
  let web3 = store.getState().web3.web3Instance;
  if (typeof web3 !== 'undefined') {
    return (dispatch) => {
      dispatch(confirmTicketActions.started());
      const ticketExchange = contract(TicketExchangeContract);
      ticketExchange.setProvider(web3.currentProvider);
      var ticketExchangeInstance;

      ticketExchange.deployed()
      .then((instance) => {
        ticketExchangeInstance = instance;

        web3.eth.getCoinbase((error, coinbase) => {
          if (error) console.error(error)

          return ticketExchangeInstance.confirmTicket(ticketId, {
            from: coinbase,
            gas: 500000
          });
        });
      }).then(() => {
        dispatch(confirmTicketActions.success());
      }).then(() => {
        dispatch(fetchTickets(0));
      });
    };
  }
}

export function refundTicket(ticketId) {
  let web3 = store.getState().web3.web3Instance;
  if (typeof web3 !== 'undefined') {
    return (dispatch) => {
      dispatch(refundTicketActions.started());
      const ticketExchange = contract(TicketExchangeContract);
      ticketExchange.setProvider(web3.currentProvider);
      var ticketExchangeInstance;

      ticketExchange.deployed()
      .then((instance) => {
        ticketExchangeInstance = instance;

        web3.eth.getCoinbase((error, coinbase) => {
          if (error) console.error(error)

          return ticketExchangeInstance.refundTicket(ticketId, {
            from: coinbase,
            gas: 500000
          });
        });
      }).then(() => {
        dispatch(refundTicketActions.success());
      }).then(() => {
        dispatch(fetchTickets(0));
      });
    };
  }
}

const initialState = {
  // Update this to be fetched tickets and use selectors instead
  user: [],
  status: {
    created: [],
    locked: [],
    complete: [],
    refunded: [],
    cancelled: []
  }
};

export default handleActions({
  [fetchSuccess(FETCH_TICKETS)]: (state, action) => {
    const ticketData  = action.payload;
    const newState = state;
    newState.status[ticketData.status] = ticketData.tickets;

    return {
        ...newState
    };
  },
  [fetchSuccess(FETCH_USERS_TICKETS)]: (state, action) => {
    const ticketData  = action.payload;

    return {
        ...state,
        user: ticketData
    };
  },
  [fetchSuccess(SELL_TICKET)]: (state) => state
}, initialState);

