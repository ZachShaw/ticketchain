pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Authentication.sol";

contract TestAuthentication {

  function testUserCanSignUpAndLogin() public {
    Authentication authentication = Authentication(DeployedAddresses.Authentication());
    bytes32 name = "testuser";
    bytes32 email = "test@gmail.com";
    bytes32[] memory user = new bytes32[](2);

    user[0] = name;
    user[1] = email;

    authentication.signup(name, email);

    Assert.equal(authentication.signup(name, email), user[0], "it should signup and return name");

    // login = authentication.login();

    // Assert.equal(login, user, "It should sign up and log in a user.");
  }

}
