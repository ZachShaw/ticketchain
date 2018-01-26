/* eslint-disable */
let TicketExchange = artifacts.require("./TicketExchange.sol");

contract('TicketExchange', (accounts) => {
  let appInstance;
  let seller = accounts[4];
  let buyer = accounts[5];
  let ticketId1 = 1;
  let ticketId2 = 2;
  let eventId1 = 'EV001';
  let eventId2 = 'EV002';
  let eventName1 = 'Willers Brothers Live';
  let eventName2 = 'Lauren Lo Sung Presents..'
  let eventDescription1 = 'Minimal duo curating live beats all night long';
  let eventDescription2 = 'Lauren headlining amongst her favourite artists';
  let ticketPrice1 = web3.toWei(5, "ether");
  let ticketPrice2 = web3.toWei(10, "ether");
  let buyerBalanceBefore, buyerBalanceAfter;
  let sellerBalanceBefore, sellerBalanceAfter;

  it('should list be initialized with empty values', () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance;

      return appInstance.getNumberOfTickets();
    }).then((data) => {
      assert.equal(data, 0x0, "expect number of tickets to be zero");
    })
  }),

  it('should sell the first ticket', () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance

      return appInstance.sellTicket(eventId1, eventName1, eventDescription1, ticketPrice1, {
        from: seller
      }).then((receipt) => {
        // Check event
        const logs = receipt.logs;
        const args = logs[0].args;

        assert.equal(logs.length, 1, "expect to have received one event");
        assert.equal(args._id, ticketId1, "expect ticketId to equal " + ticketId1);
        assert.equal(args._seller, seller, "expect ticket seller to equal " + seller);
        assert.equal(args._eventName, eventName1, "expect the eventName to equal " + eventName1);
        assert.equal(args._price.toNumber(), ticketPrice1, "expect the eventPrice to equal " + ticketPrice1);
      }).then(() => {
        return appInstance.getNumberOfTickets();
      }).then((data) => {
        assert.equal(data.toNumber(), 1, "expect one ticket to be listed");
        
        return appInstance.tickets(ticketId1);
      }).then((data) => {
        assert.equal(data[0].toNumber(), ticketId1, "expect ticketId to equal " + ticketId1);
        assert.equal(data[1], seller, "expect ticket seller to equal " + seller);
        assert.equal(data[2], 0x0, "expect there to be no buyer yet " + 0x0);
        assert.equal(data[3], eventId1, "expect the eventId to equal " + eventId1);
        assert.equal(data[4], eventName1, "expect the eventName to equal " + eventName1);
        assert.equal(data[5], eventDescription1, "expect the eventDescription to equal " + eventDescription1);
        assert.equal(data[6].toNumber(), ticketPrice1, "expect the eventPrice to equal " + ticketPrice1);
      })
    })
  }),

  it('should sell the second ticket', () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance

      return appInstance.sellTicket(eventId2, eventName2, eventDescription2, ticketPrice2, {
        from: seller
      }).then((receipt) => {
        // Check event
        assert.equal(receipt.logs.length, 1, "expect to have received one event");
        assert.equal(receipt.logs[0].args._id, ticketId2, "expect ticketId to equal " + ticketId2);
        assert.equal(receipt.logs[0].args._seller, seller, "expect ticket seller to equal " + seller);
        assert.equal(receipt.logs[0].args._eventName, eventName2, "expect the eventName to equal " + eventName2);
        assert.equal(receipt.logs[0].args._price.toNumber(), ticketPrice2, "expect the eventPrice to equal " + ticketPrice2 + "ETH");
      }).then(() => {
        return appInstance.getNumberOfTickets();
      }).then((data) => {
        assert.equal(data.toNumber(), 2, "expect two tickets to be listed");
        
        return appInstance.tickets(ticketId2);
      }).then((data) => {
        assert.equal(data[0].toNumber(), ticketId2, "expect ticketId to equal " + ticketId2);
        assert.equal(data[1], seller, "expect ticket seller to equal " + seller);
        assert.equal(data[2], 0x0, "expect there to be no buyer yet " + 0x0);
        assert.equal(data[3], eventId2, "expect the eventId to equal " + eventId2);
        assert.equal(data[4], eventName2, "expect the eventName to equal " + eventName2);
        assert.equal(data[5], eventDescription2, "expect the eventDescription to equal " + eventDescription2);
        assert.equal(data[6].toNumber(), ticketPrice2, "expect the eventPrice to equal " + ticketPrice2 + "ETH");
      })
    })
  }),

  it('should buy a ticket and successfully represent this purchase in the chain data', () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance;

      sellerBalanceBefore = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
      buyerBalanceBefore = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();

      return appInstance.buyTicket(ticketId1, {
        from: buyer,
        value: ticketPrice1
      });
    }).then((receipt) => {
      // Check event
      const logs = receipt.logs;
      const args = logs[0].args;

      assert.equal(logs.length, 1, "expect to receive one event");
      assert.equal(args._id, ticketId1, "expect ticketId to equal " + ticketId1);
      assert.equal(args._seller, seller, "expect seller to equal " + seller);
      assert.equal(args._buyer, buyer, "expect buyer to equal " + buyer);
      assert.equal(args._eventName, eventName1, "expect eventName to equal " + eventName1);
      assert.equal(args._price.toNumber(), ticketPrice1, "expect eventPrice to equal " + ticketPrice1 + "ETH");

      sellerBalanceAfter = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
      buyerBalanceAfter = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();

      // Check the balances reflect transaction correctly, accounting for gas spent
      assert(sellerBalanceAfter >= sellerBalanceBefore + web3.fromWei(ticketPrice1), "seller should have earnt " + web3.fromWei(ticketPrice1) + "ETH");
      assert(buyerBalanceAfter <= buyerBalanceBefore - web3.fromWei(ticketPrice1), "seller should have earnt " + web3.fromWei(ticketPrice1) + "ETH");

      // To Do: Get remaining tickets still for sale count - Expected: 1
      return appInstance.getTicketsForSale();
    }).then((data) => {
      assert.equal(data.length, 1, "expect only one ticket to still be on sale");
    })
  })
});
