import { createSelector } from 'reselect';
import { convertStatus } from '../util/tickets/status.js';

const userTickets = state => state.ticket.user;
const username = state => state.user.username;

export const userSellingTickets = createSelector(
  userTickets,
  username,
  (tickets, username) => tickets.filter((ticket) => 
    ticket.status === convertStatus('selling'))
)

export const userBoughtTickets = createSelector(
  userTickets,
  username,
  (tickets, username) => tickets.filter((ticket) => 
    ticket.status === convertStatus('bought') && ticket.user.username !== username)
)