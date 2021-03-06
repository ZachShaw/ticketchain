/* eslint-disable */
let TicketExchange = artifacts.require("./TicketExchange.sol");

contract('TicketExchange', (accounts) => {
  let appInstance,
      seller = accounts[2],
      buyer = accounts[1],
      ticketId1 = 1,
      ticketId2 = 2,
      ticketId3 = 3,
      eventId1 = 'EV001',
      eventId2 = 'EV002',
      eventId3 = 'EV003',
      eventName1 = 'Willers Brothers Live',
      eventName2 = 'Lauren Lo Sung Presents..',
      eventName3 = 'Hunee All Night..',
      ticketPrice1 = web3.toWei(5, "ether"),
      ticketPrice2 = web3.toWei(10, "ether"),
      ticketPrice3 = web3.toWei(2, "ether"),
      buyerBalanceBefore, buyerBalanceAfter,
      sellerBalanceBefore, sellerBalanceAfter;

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

      return appInstance.sellTicket(eventId1, eventName1, ticketPrice1, {
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
        assert.equal(web3.toUtf8(args._status), "created", "expect ticketStatus to equal created");
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
        assert.equal(data[5].toNumber(), ticketPrice1, "expect the eventPrice to equal " + ticketPrice1);
      })
    })
  }),

  it('should have no tickets associated with buyer wallet address', () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance

      return appInstance.getTicketsByUser(seller)
    }).then((data) => {
      assert.equal(data.length, 0, "expect two tickets to be associated with user");
    })
  }),

  it('should sell the second ticket', () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance

      return appInstance.sellTicket(eventId2, eventName2, ticketPrice2, {
        from: seller
      }).then((receipt) => {
        const logs = receipt.logs;
        const args = logs[0].args;
        assert.equal(logs.length, 1, "expect to have received one event");
        assert.equal(args._id, ticketId2, "expect ticketId to equal " + ticketId2);
        assert.equal(args._seller, seller, "expect ticket seller to equal " + seller);
        assert.equal(args._eventName, eventName2, "expect the eventName to equal " + eventName2);
        assert.equal(args._price.toNumber(), ticketPrice2, "expect the eventPrice to equal " + ticketPrice2 + "ETH");
        assert.equal(web3.toUtf8(args._status), "created", "expect ticketStatus to equal created");
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
        assert.equal(data[5].toNumber(), ticketPrice2, "expect the eventPrice to equal " + ticketPrice2 + "ETH");
      })
    })
  }),

  it('should take payment from buyer for the 1st ticket and set ticket status to locked', () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance;

      buyerBalanceBefore = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();

      return appInstance.buyTicket(ticketId1, {
        from: buyer,
        value: ticketPrice1
      });
    }).then((receipt) => {

      const logs = receipt.logs;
      const args = logs[0].args;

      assert.equal(logs.length, 1, "expect to receive one event");
      assert.equal(args._id, ticketId1, "expect ticketId to equal " + ticketId1);
      assert.equal(args._seller, seller, "expect seller to equal " + seller);
      assert.equal(args._buyer, buyer, "expect buyer to equal " + buyer);
      assert.equal(args._eventName, eventName1, "expect eventName to equal " + eventName1);
      assert.equal(args._price.toNumber(), ticketPrice1, "expect eventPrice to equal " + ticketPrice1 + "ETH");
      assert.equal(web3.toUtf8(args._status), "locked", "expect ticketStatus to equal locked");

      buyerBalanceAfter = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();

      assert(buyerBalanceAfter <= buyerBalanceBefore - web3.fromWei(ticketPrice1), "buyer should have spent " + web3.fromWei(ticketPrice1) + "ETH");

      return appInstance.getTicketsByStatus(0);
    }).then((data) => {
      assert.equal(data.length, 1, "expect only one ticket to still be on sale");
      return appInstance.getTicketsByStatus(1);
    }).then((data) => {
      assert.equal(data.length, 1, "expect only one ticket to be locked");
    })
  }),

  it('should confirm ticket as valid from the buyer and release payment to the seller', () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance;

      sellerBalanceBefore = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();

      return appInstance.confirmTicket(ticketId1, {
        from: buyer
      });
    }).then((receipt) => {
      const logs = receipt.logs;
      const args = logs[0].args;

      sellerBalanceAfter = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
      assert.equal(web3.toUtf8(args._status), "complete", "ticket status to be updated to complete");
      assert(sellerBalanceAfter >= sellerBalanceBefore + web3.fromWei(ticketPrice1), "seller should have earnt " + web3.fromWei(ticketPrice1) + "ETH");
      
      return appInstance.getTicketsByStatus(1);
    }).then((data) => {
      assert.equal(data.length, 0, "expect no tickets to be locked");
    })
  }),

  it('should refund purchase of second ticket back to the buyers account', () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance;

      buyerBalanceBefore = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();
      buyerBalanceMinusGas = buyerBalanceBefore * 0.99 // Rough estimate of 1% paid in gas

      appInstance.buyTicket(ticketId2, {
        from: buyer,
        value: ticketPrice2
      });
      return appInstance.getTicketsByStatus(1);
    }).then((data) => {
      assert.equal(data.length, 1, "expect only one ticket to be locked");

      return appInstance.refundTicket(ticketId2, {
        from: seller
      });
    }).then((receipt) => {
      buyerBalanceAfter = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();
      const logs = receipt.logs;
      const args = logs[0].args;
      assert.equal(web3.toUtf8(args._status), "refunded", "ticket status to be updated to refunded");

      assert(buyerBalanceAfter > buyerBalanceMinusGas && buyerBalanceAfter < buyerBalanceBefore, "buyer should received a refund within 99% of original price paid");
    })
  }),

  it('should sell and cancel a third ticket from the seller', () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance

      return appInstance.sellTicket(eventId3, eventName3, ticketPrice3, {
        from: seller
      }).then((receipt) => {
        const logs = receipt.logs;
        const args = logs[0].args;
        assert.equal(web3.toUtf8(args._status), "created", "expect ticketStatus to equal created");
        
        return appInstance.cancelTicket(ticketId3, {
          from: seller
        });
      }).then((receipt) => {
        const logs = receipt.logs;
        const args = logs[0].args;
        assert.equal(web3.toUtf8(args._status), "cancelled", "expect ticketStatus to equal cancelled");
      })
    })
  }),

  it('should get all tickets associated with particular wallet address', () => {
    return TicketExchange.deployed().then((instance) => {
      appInstance = instance

      return appInstance.getTicketsByUser(buyer)
    }).then((data) => {
      assert.equal(data.length, 2, "expect two tickets to be associated with user");
    })
  });
});
