pragma solidity ^0.4.11;

import './zeppelin/lifecycle/Killable.sol';

contract TicketExchange is Killable {
  
  // State variables
  mapping(uint => Ticket) public tickets;
  uint ticketCounter;
  enum TicketStatus { Created, Locked, Closed }
  TicketStatus public state;

  struct Ticket {
    uint id;
    address seller;
    address buyer;
    string eventId;
    string eventName;
    uint256 price;
    TicketStatus status;
  }

  event SellTicketEvent (
    uint indexed _id,
    address indexed _seller,
    string _eventName,
    uint256 _price
  );

  event BuyTicketEvent (
    uint indexed _id,
    address indexed _seller,
    address indexed _buyer,
    string _eventName,
    uint256 _price
  );

  event TicketConfirmed();

  function sellTicket(string _eventId, string _eventName, uint _price) public {
    ticketCounter++;

    // Storing ticket
    tickets[ticketCounter] = Ticket(
      ticketCounter,
      msg.sender,
      0x0,
      _eventId,
      _eventName,
      _price,
      TicketStatus.Created
    );

    SellTicketEvent(ticketCounter, msg.sender, _eventName, _price);
  }

  function buyTicket(uint _id) 
    payable
    public
  {
    require(ticketCounter > 0);
    require(_id > 0 && _id <= ticketCounter);

    Ticket storage ticket = tickets[_id];

    require(ticket.buyer == 0x0);
    require(ticket.seller != msg.sender);
    require(ticket.price == msg.value);

    ticket.buyer = msg.sender;
    // ticket.seller.transfer(msg.value);
    ticket.status = TicketStatus.Locked;

    BuyTicketEvent(_id, ticket.seller, ticket.buyer, ticket.eventName, ticket.price);
  }

  function confirmTicket(uint _id)
    public
  {
    Ticket storage ticket = tickets[_id];

    require(ticket.status == TicketStatus.Locked);
    require(ticket.buyer == msg.sender);

    ticket.status = TicketStatus.Closed;

    ticket.seller.transfer(ticket.price);

    TicketConfirmed();
  }

  function getNumberOfTickets() public constant returns (uint) {
    return ticketCounter;
  }

  function getTicketsForSale() public constant returns (uint[]) {

    if (ticketCounter == 0) {
      return new uint[](0);
    }

    // Prepare array for all tickets as ticketIds with new array length ticketCounter
    uint[] memory ticketIds = new uint[](ticketCounter);

    uint numberOfTicketsForSale = 0;

    for (uint i = 1; i <= ticketCounter; i++) {
      if (tickets[i].buyer == 0x0) {
        ticketIds[numberOfTicketsForSale] = tickets[i].id;
        numberOfTicketsForSale++;
      }
    }

    // New array just for tickets that have not been sold yet
    uint[] memory ticketsForSale = new uint[](numberOfTicketsForSale);

    for (uint j = 0; j < numberOfTicketsForSale; j++) {
      ticketsForSale[j] = ticketIds[j];
    }
    
    return (ticketsForSale);
  }
 }