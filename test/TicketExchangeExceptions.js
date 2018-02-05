/* eslint-disable */
let TicketExchange = artifacts.require("./TicketExchange.sol");

contract('TicketExchange', (accounts) => {
  let appInstance;
  let seller = accounts[1];
  let buyer = accounts[2];
  let ticketId = 1;
  let eventId = 'EV001';
  let eventName = 'Dimensions Festival 2018';
  let ticketPrice = 0.5;
  let weiPrice = web3.toWei(ticketPrice, "ether");

  it("should throw an exception if you try to buy a ticket when none are for sale", () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance;
      return appInstance.buyTicket(ticketId, {
        from: buyer,
        value: weiPrice
      });
    }).then(assert.fail)
    .catch((error) => {
    }).then(() => {
      return appInstance.getNumberOfTickets();
    }).then((data) => {
      assert.equal(data.toNumber(), 0, "number of tickets must be 0");
    });
  }),
  
  it("should throw an exception if you try to buy an ticket that does not exist", () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance;
      appInstance.sellTicket(eventId, eventName, weiPrice, {
        from: seller
      });
    }).then((receipt) => {
      return appInstance.buyTicket(2, {
        from: buyer,
        value: weiPrice
      });
    }).then(assert.fail)
    .catch((error) => {
    }).then((data) => {
      return appInstance.tickets(ticketId);
    }).then((data) => {

      assert.equal(data[0].toNumber(), ticketId, "ticketId must be equal to " + ticketId);
      assert.equal(data[1], seller, "seller must be equal to " + seller);
      assert.equal(data[2], 0x0, "there shouldnt be a buyer yet");
      assert.equal(data[3], eventId, "eventId must be equal to " + eventId);
      assert.equal(data[4], eventName, "event name must be equal to " + eventName);
      assert.equal(data[5].toNumber(), weiPrice, "ticket price must be equal to " + weiPrice);

      return appInstance.getNumberOfTickets();
    }).then((data) => {
      assert.equal(data.toNumber(), 1, "one event should be listed");
    })
  }),

  it("should throw an exception if the same user trys to buy their own ticket", () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance;
      return appInstance.buyTicket(ticketId, {
        from: seller,
        value: weiPrice
      });
    }).then(assert.fail)
    .catch((error) => {
    }).then(() => {
      return appInstance.tickets(ticketId)
    }).then((data) => {

      assert.equal(data[0].toNumber(), ticketId, "ticketID must be equal to " + ticketId);
      assert.equal(data[1], seller, "seller must be equal to +", seller);
      assert.equal(data[2], 0x0, "buyer must still be empty ");
      assert.equal(data[3], eventId, "eventId must be equal to " + eventId);
      assert.equal(data[4], eventName, "eventName must be equal to " + eventName);
      assert.equal(data[5].toNumber(), weiPrice, "ticket price must be equal to " + weiPrice);

      return appInstance.getNumberOfTickets();
    }).then((data) => {
      assert.equal(data.toNumber(), 1, "one event should still be listed");
    })
  }),

  it("should throw an exception if the ticket is purchased with the incorrect price", () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance;

      return appInstance.buyTicket(ticketId, {
        from: buyer,
        value: web3.toWei(ticketPrice + 1, "ether")
      });
    }).then(assert.fail)
    .catch((error) => {
    }).then(() => {
      return appInstance.tickets(ticketId)
    }).then((data) => {
      
      assert.equal(data[0].toNumber(), ticketId, "ticketID must be equal to " + ticketId);
      assert.equal(data[1], seller, "seller must be equal to +", seller);
      assert.equal(data[2], 0x0, "buyer must still be empty ");
      assert.equal(data[3], eventId, "eventId must be equal to " + eventId);
      assert.equal(data[4], eventName, "eventName must be equal to " + eventName);
      assert.equal(data[5].toNumber(), weiPrice, "ticket price must be equal to " + weiPrice);

      return appInstance.getNumberOfTickets();
    }).then((data) => {
      assert.equal(data.toNumber(), 1, "one event should still be listed");
    });
  }),

  it("should throw and exception if the ticket has already been bought by another user", () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance;

      return appInstance.buyTicket(ticketId, {
        from: buyer,
        value: weiPrice
      });
    }).then(() => {
      return appInstance.buyTicket(ticketId, {
        from: web3.eth.accounts[0],
        value: weiPrice
      })
    }).then(assert.fail)
    .catch((error) => {
    }).then(() => {
      return appInstance.tickets(ticketId)
    }).then((data) => {
      
      assert.equal(data[0].toNumber(), ticketId, "expect tickedId to equal " + ticketId);
      assert.equal(data[1], seller, "expect seller to equal " + seller);
      assert.equal(data[2], buyer, "expect buyer to equal " + buyer);
      assert.equal(data[3], eventId, "expect eventId to equal " + eventId);
      assert.equal(data[4], eventName, "expect eventName to equal " + eventName);
      assert.equal(data[5], weiPrice, "expect price to be equal to " + weiPrice);

      return appInstance.getNumberOfTickets();
    }).then((data) => {
      assert.equal(data.toNumber(), 1, "one event should still be listed");
    });
  });
});