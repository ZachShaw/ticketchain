pragma solidity ^0.4.2;

import './zeppelin/lifecycle/Killable.sol';

contract TicketExchange is Killable {
  struct Ticket {
    uint id;
    address seller;
    address buyer;
    string eventId;
    string eventName;
    string eventDescription;
    uint256 price;
  }

  // State variables
  mapping(uint => Ticket) public tickets;
  uint ticketCounter;

  // Events
  event SellTicketEvent (
    uint indexed _id,
    address indexed _seller,
    string _eventName,
    uint256 price
  );

  event BuyTicketEvent (
    uint indexed _id,
    address indexed _seller,
    address indexed _buyer,
    string _eventName,
    uint256 _price
  );

  function sellTicket(string _eventId, string _eventName, string _eventDescription, uint _price) public {
    // New ticket
    ticketCounter++;

    // Storing ticket
    tickets[ticketCounter] = Ticket(
      ticketCounter,
      msg.sender,
      0x0,
      _eventId,
      _eventName,
      _eventDescription,
      _price
    );

    // Fire SellTicket event
    SellTicketEvent(ticketCounter, msg.sender, _eventName, _price);
  }

  function buyTicket(uint _id) payable public {
    // At least one ticket for sale
    require(ticketCounter > 0);
    // Ticket actually exists (Will never be zero or over ticketCounters value)
    require(_id > 0 && _id <= ticketCounter);
    
    // Ticket exists - Fetch from array
    Ticket storage ticket = tickets[_id];

    // Ensure ticket hasn't already been bought
    require(ticket.buyer == 0x0);
    // Ensure ticket buyer isn't the same as the seller
    require(ticket.seller != msg.sender);
    // Ensure buyers value matches price in Ether
    require(ticket.price == msg.value);
    // Store buyers address
    ticket.buyer = msg.sender;

    // All checks passed and ticket updated with buyers details so transfer value
    ticket.seller.transfer(msg.value);

    // Trigger buy event
    BuyTicketEvent(_id, ticket.seller, ticket.buyer, ticket.eventName, ticket.price);
  }

  function getNumberOfTickets() public constant returns (uint) {
    return ticketCounter;
  }
 }