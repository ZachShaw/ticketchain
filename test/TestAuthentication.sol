pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Authentication.sol";

contract TestAuthentication {

  function testUserCanSignUpAndLogin() public {
    Authentication authentication = Authentication(DeployedAddresses.Authentication());
    bytes32 name = "Zach Shaw";
    bytes32 email = "zach@gmail.com";
    bytes32 username = "zshaw";
    bytes32[] memory user = new bytes32[](3);

    user[0] = name;
    user[1] = email;
    user[2] = username;

    authentication.signup(name, email, username);

    Assert.equal(authentication.signup(name, email, username), user[0], "it should signup and return name");

    // login = authentication.login();

    // Assert.equal(login, user, "It should sign up and log in a user.");
  }

}
