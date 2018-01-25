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

  it("should throw an exception if you try to buy a ticket when none are for sale", function() {
    return TicketExchange.deployed().then(function(instance) {
      appInstance = instance;
      return appInstance.buyTicket(ticketId, {
        from: buyer,
        value: web3.toWei(ticketPrice, "ether")
      });
    }).then(assert.fail)
    .catch(function(error) {
    // Catch error from failing to buy ticketId = 1
    }).then(function() {
      return appInstance.getNumberOfTickets();
    }).then(function(data) {
      //make sure sure the contract state was not altered
      assert.equal(data.toNumber(), 0, "number of tickets must be 0");
    });
  }),
  
  it("should throw an exception if you try to buy an ticket that does not exist", function() {
    return TicketExchange.deployed().then(function(instance) {
      appInstance = instance;
      appInstance.sellTicket(eventId, eventName, eventDescription, web3.toWei(ticketPrice, "ether"), {
        from: seller
      });
    }).then(function(receipt) {
      return appInstance.buyTicket(2, {
        from: buyer,
        value: web3.toWei(ticketPrice, "ether")
      });
    }).then(assert.fail)
    .catch(function(error) {

    }).then(function(data) {
      return appInstance.tickets(ticketId);
    }).then(function(data) {
      let price = web3.toWei(ticketPrice, "ether");

      assert.equal(data[0].toNumber(), ticketId, "ticketId must be equal to " + ticketId);
      assert.equal(data[1], seller, "seller must be equal to " + seller);
      assert.equal(data[2], 0x0, "there shouldnt be a buyer yet");
      assert.equal(data[3], eventId, "eventId must be equal to " + eventId);
      assert.equal(data[4], eventName, "event name must be equal to " + eventName);
      assert.equal(data[5], eventDescription, "event name must be equal to " + eventDescription);
      assert.equal(data[6].toNumber(), price, "ticket price must be equal to " + price);

      return appInstance.getNumberOfTickets();
    }).then(function(data) {
      assert.equal(data.toNumber(), 1, "one event should be listed");
    })
  })
})