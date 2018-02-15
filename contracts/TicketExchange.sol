pragma solidity ^0.4.18;

import './zeppelin/lifecycle/Killable.sol';

contract TicketExchange is Killable {
  
  // State variables
  mapping(uint => Ticket) public tickets;
  uint ticketCounter;
  enum TicketStatus { Created, Locked, Complete, Refunded, Cancelled } // { 0, 1, 2, 3, 4 }
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

  event TicketConfirmed(bytes32 _status);
  event TicketRefunded(bytes32 _status);
  event TicketCancelled(bytes32 _status);

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
    if (TicketStatus.Complete == status)
      return "complete";
    if (TicketStatus.Refunded == status)
      return "refunded";
    if (TicketStatus.Cancelled == status)
      return "cancelled";
    return "";
  }

  function cancelTicket(uint _id)
    public
    onlySeller(_id)
  {
      Ticket storage ticket = tickets[_id];
      ticket.status = TicketStatus.Cancelled;
      ticketStatus = getEnumValue(TicketStatus.Cancelled);
      TicketCancelled(ticketStatus);
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
    ticket.status = TicketStatus.Complete;
    ticket.seller.transfer(ticket.price);
    ticketStatus = getEnumValue(TicketStatus.Complete);
    TicketConfirmed(ticketStatus);
  }

  function refundTicket(uint _id)
    public
    onlySeller(_id)
  {
    Ticket storage ticket = tickets[_id];
    require(ticket.status == TicketStatus.Locked);
    ticket.status = TicketStatus.Refunded;
    ticket.buyer.transfer(ticket.price);
    ticketStatus = getEnumValue(TicketStatus.Refunded);
    TicketRefunded(ticketStatus);
  }

  function getNumberOfTickets() public constant returns (uint) {
    return ticketCounter;
  }

  function getTicketsByStatus(uint _index)
    public
    view
    returns (uint[])
  {
    noTickets();
    TicketStatus ts;
    ts = TicketStatus(_index);

    uint[] memory ticketIds = new uint[](ticketCounter);
    uint numberOfTickets = 0;

    for (uint i = 1; i <= ticketCounter; i++) {
      if (tickets[i].status == ts) {
        ticketIds[numberOfTickets] = tickets[i].id;
        numberOfTickets++;
      }
    }

    // New array just for tickets that match status
    uint[] memory filteredTickets = new uint[](numberOfTickets);

    for (uint j = 0; j < numberOfTickets; j++) {
      filteredTickets[j] = ticketIds[j];
    }
    
    return (filteredTickets);
  }
 }