import { getEnumStatus } from './status';
import store from '../../store';

export function createTicket(ticket, user) {
  let web3 = store.getState().web3.web3Instance;
  const newTicket = {
    ticketId: ticket[0].toNumber(),
    seller: ticket[1],
    user,
    buyer: ticket[2],
    eventId: ticket[3],
    eventName: ticket[4],
    price: web3.fromWei(ticket[5].toNumber()),
    status: getEnumStatus(ticket[6].toNumber())
  };
  return newTicket;
}