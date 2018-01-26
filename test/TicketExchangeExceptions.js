var TicketExchange = artifacts.require("./TicketExchange.sol");

contract('TicketExchange', function(accounts) {
  var appInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var ticketId = 1;
  var eventId = 'EV001';
  var eventName = 'Dimensions Festival 2018';
  var eventDescription = 'Underground music festival in abandoned Roman fort';
  var ticketPrice = 0.5;
  var weiPrice = web3.toWei(ticketPrice, "ether");

  it("should throw an exception if you try to buy a ticket when none are for sale", function() {
    return TicketExchange.deployed().then(function(instance) {
      appInstance = instance;
      return appInstance.buyTicket(ticketId, {
        from: buyer,
        value: weiPrice
      });
    }).then(assert.fail)
    .catch(function(error) {
    }).then(function() {
      return appInstance.getNumberOfTickets();
    }).then(function(data) {
      assert.equal(data.toNumber(), 0, "number of tickets must be 0");
    });
  }),
  
  it("should throw an exception if you try to buy an ticket that does not exist", function() {
    return TicketExchange.deployed().then(function(instance) {
      appInstance = instance;
      appInstance.sellTicket(eventId, eventName, eventDescription, weiPrice, {
        from: seller
      });
    }).then(function(receipt) {
      return appInstance.buyTicket(2, {
        from: buyer,
        value: weiPrice
      });
    }).then(assert.fail)
    .catch(function(error) {

    }).then(function(data) {
      return appInstance.tickets(ticketId);
    }).then(function(data) {

      assert.equal(data[0].toNumber(), ticketId, "ticketId must be equal to " + ticketId);
      assert.equal(data[1], seller, "seller must be equal to " + seller);
      assert.equal(data[2], 0x0, "there shouldnt be a buyer yet");
      assert.equal(data[3], eventId, "eventId must be equal to " + eventId);
      assert.equal(data[4], eventName, "event name must be equal to " + eventName);
      assert.equal(data[5], eventDescription, "event name must be equal to " + eventDescription);
      assert.equal(data[6].toNumber(), weiPrice, "ticket price must be equal to " + weiPrice);

      return appInstance.getNumberOfTickets();
    }).then(function(data) {
      assert.equal(data.toNumber(), 1, "one event should be listed");
    })
  }),

  it("should throw an exception if the same user trys to buy their own ticket", function() {
    return TicketExchange.deployed().then(function(instance) {
      appInstance = instance;
      return appInstance.buyTicket(ticketId, {
        from: seller,
        value: weiPrice
      });
    }).then(assert.fail)
    .catch(function(error) {
    }).then(function() {
      return appInstance.tickets(ticketId)
    }).then(function(data) {

      assert.equal(data[0].toNumber(), ticketId, "ticketID must be equal to " + ticketId);
      assert.equal(data[1], seller, "seller must be equal to +", seller);
      assert.equal(data[2], 0x0, "buyer must still be empty ");
      assert.equal(data[3], eventId, "eventId must be equal to " + eventId);
      assert.equal(data[4], eventName, "eventName must be equal to " + eventName);
      assert.equal(data[5], eventDescription, "eventDescripion must be equal to " + eventDescription);
      assert.equal(data[6].toNumber(), weiPrice, "ticket price must be equal to " + weiPrice);

      return appInstance.getNumberOfTickets();
    }).then(function(data) {
      assert.equal(data.toNumber(), 1, "one event should still be listed");
    })
  }),

  it("should throw an exception if the ticket is purchased with the incorrect price", function() {
    return TicketExchange.deployed().then(function(instance) {
      appInstance = instance;

      return appInstance.buyTicket(ticketId, {
        from: buyer,
        value: web3.toWei(ticketPrice + 1, "ether")
      });
    }).then(assert.fail)
    .catch(function(error) {
    }).then(function() {
      return appInstance.tickets(ticketId)
    }).then(function(data) {
      
      assert.equal(data[0].toNumber(), ticketId, "ticketID must be equal to " + ticketId);
      assert.equal(data[1], seller, "seller must be equal to +", seller);
      assert.equal(data[2], 0x0, "buyer must still be empty ");
      assert.equal(data[3], eventId, "eventId must be equal to " + eventId);
      assert.equal(data[4], eventName, "eventName must be equal to " + eventName);
      assert.equal(data[5], eventDescription, "eventDescripion must be equal to " + eventDescription);
      assert.equal(data[6].toNumber(), weiPrice, "ticket price must be equal to " + weiPrice);

      return appInstance.getNumberOfTickets();
    }).then(function(data) {
      assert.equal(data.toNumber(), 1, "one event should still be listed");
    });
  }),

  it("should throw and exception if the ticket has already been bought by another user", function() {
    return TicketExchange.deployed().then(function(instance) {
      appInstance = instance;

      return appInstance.buyTicket(ticketId, {
        from: buyer,
        value: weiPrice
      });
    }).then(function() {
      return appInstance.buyTicket(ticketId, {
        from: web3.eth.accounts[0],
        value: weiPrice
      })
    }).then(assert.fail)
    .catch(function(error) {
    }).then(function() {
      return appInstance.tickets(ticketId)
    }).then(function(data) {
      
      assert.equal(data[0].toNumber(), ticketId, "expect tickedId to equal " + ticketId);
      assert.equal(data[1], seller, "expect seller to equal " + seller);
      assert.equal(data[2], buyer, "expect buyer to equal " + buyer);
      assert.equal(data[3], eventId, "expect eventId to equal " + eventId);
      assert.equal(data[4], eventName, "expect eventName to equal " + eventName);
      assert.equal(data[5], eventDescription, "expect eventDescription to equal " + eventDescription);
      assert.equal(data[6], weiPrice, "expect price to be equal to " + weiPrice);

      return appInstance.getNumberOfTickets();
    }).then(function(data) {
      assert.equal(data.toNumber(), 1, "one event should still be listed");
    });
  });
});