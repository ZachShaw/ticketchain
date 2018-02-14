pragma solidity ^0.4.11;

import './zeppelin/lifecycle/Killable.sol';

contract TicketExchange is Killable {
  
  // State variables
  mapping(uint => Ticket) public tickets;
  uint ticketCounter;
  enum TicketStatus { Created, Locked, Closed }
  TicketStatus public state;
  bytes32 ticketStatus;

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
    uint256 _price,
    bytes32 _status
  );

  event BuyTicketEvent (
    uint indexed _id,
    address indexed _seller,
    address indexed _buyer,
    string _eventName,
    uint256 _price,
    bytes32 _status
  );

  event TicketConfirmed();
  event TicketRefunded();

  modifier onlyBuyer(uint _id) {
    Ticket storage ticket = tickets[_id];
    require(ticket.buyer == msg.sender);
    _;
  }

  modifier onlySeller(uint _id) {
    Ticket storage ticket = tickets[_id];
    require(ticket.seller == msg.sender);
    _;
  }

  function noTickets()
    public
    view
    returns (uint[]) 
  {
    if (ticketCounter == 0) {
      return new uint[](0);
    }
  }

  function getEnumValue(TicketStatus status) 
    public 
    pure
    returns (bytes32)
  {
    if (TicketStatus.Created == status) 
      return "created";
    if (TicketStatus.Locked == status) 
      return "locked";
    if (TicketStatus.Closed == status)
      return "closed";
    return "";
  }

  function sellTicket(string _eventId, string _eventName, uint _price) 
    public 
  {
    ticketCounter++; // TicketId

    tickets[ticketCounter] = Ticket(
      ticketCounter,
      msg.sender,
      0x0,
      _eventId,
      _eventName,
      _price,
      TicketStatus.Created
    );

    ticketStatus = getEnumValue(TicketStatus.Created);

    SellTicketEvent(ticketCounter, msg.sender, _eventName, _price, ticketStatus);
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
    require(ticket.status == TicketStatus.Created);

    ticket.buyer = msg.sender;
    ticket.status = TicketStatus.Locked;

    ticketStatus = getEnumValue(TicketStatus.Locked);

    BuyTicketEvent(_id, ticket.seller, ticket.buyer, ticket.eventName, ticket.price, ticketStatus);
  }

  function confirmTicket(uint _id)
    public
    onlyBuyer(_id)
  {
    Ticket storage ticket = tickets[_id];

    require(ticket.status == TicketStatus.Locked);

    ticket.status = TicketStatus.Closed;

    ticket.seller.transfer(ticket.price);

    TicketConfirmed();
  }

  function refundTicket(uint _id)
    public
    onlySeller(_id)
  {
    Ticket storage ticket = tickets[_id];

    require(ticket.status == TicketStatus.Locked);

    ticket.status = TicketStatus.Closed;

    ticket.buyer.transfer(ticket.price);

    TicketRefunded();
  }

  function getNumberOfTickets() public constant returns (uint) {
    return ticketCounter;
  }

  function getLockedTickets() public constant returns (uint[]) {
    noTickets();

    // Prepare array for all tickets as ticketIds with new array length ticketCounter
    uint[] memory ticketIds = new uint[](ticketCounter);

    uint numberOfLockedTickets = 0;

    for (uint i = 1; i <= ticketCounter; i++) {
      if (tickets[i].status == TicketStatus.Locked) {
        ticketIds[numberOfLockedTickets] = tickets[i].id;
        numberOfLockedTickets++;
      }
    }

    // New array just for tickets that have been locked and require an action
    uint[] memory lockedTickets = new uint[](numberOfLockedTickets);

    for (uint j = 0; j < numberOfLockedTickets; j++) {
      lockedTickets[j] = ticketIds[j];
    }
    
    return (lockedTickets);
  }

  function getTicketsForSale() public constant returns (uint[]) {

    noTickets();

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