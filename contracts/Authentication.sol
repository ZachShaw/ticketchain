pragma solidity ^0.4.2;

import './zeppelin/lifecycle/Killable.sol';

contract Authentication is Killable {
  struct User {
    bytes32 name;
    bytes32 email;
    bytes32 username;
  }

  mapping (address => User) private users;

  uint private id; // Stores user id temporarily

  event Signup();

  modifier onlyExistingUser {
    // Check if user exists or terminate

    require(!(users[msg.sender].name == 0x0));
    _;
  }

  modifier onlyValidName(bytes32 name) {
    // Only valid names allowed

    require(!(name == 0x0));
    _;
  }

  function login() constant
  public
  onlyExistingUser
  returns (bytes32[]) 
  {
    bytes32[] memory user = new bytes32[](3);
    user[0] = users[msg.sender].name;
    user[1] = users[msg.sender].email;
    user[2] = users[msg.sender].username;

    return (user);
  }

  function signup(bytes32 name, bytes32 email, bytes32 username)
  public
  payable
  onlyValidName(name)
  returns (bytes32) 
  {
    // Check if user exists.
    // If yes, return user name.
    // If no, check if name was sent.
    // If yes, create and return user.
    Signup();
    if (users[msg.sender].name == 0x0) {
        users[msg.sender].name = name;
        users[msg.sender].email = email;
        users[msg.sender].username = username;

        return (users[msg.sender].name);
    }

    return (users[msg.sender].name);
  }

  function update(bytes32 name, bytes32 email, bytes32 username)
  public
  payable
  onlyValidName(name)
  onlyExistingUser
  returns (bytes32) 
  {
    // Update user details.

    if (users[msg.sender].name != 0x0) {
        users[msg.sender].name = name;
        users[msg.sender].email = email;
        users[msg.sender].username = username;

        return (users[msg.sender].name);
    }
  }

  function getUser(address _address)
  constant 
  public 
  returns (bytes32[])
  {
    // Only proceed if address is sent
    if (_address != 0x0) {
      bytes32[] memory user = new bytes32[](3);
      user[0] = users[_address].name;
      user[1] = users[_address].email;
      user[2] = users[_address].username;

      return (user);
    }
  }
}
