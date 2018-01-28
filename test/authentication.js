/* eslint-disable */
let Authentication = artifacts.require("./Authentication.sol");

contract('Authentication', (accounts) => {
  let name = 'testuser';
  let email = 'test@gmail.com';

  it("...should sign up and log in a user.", () => {
    return Authentication.deployed().then((instance) => {
      authenticationInstance = instance;

      return authenticationInstance.signup(name, email, {from: accounts[0]});
    }).then(() => {
      return authenticationInstance.login();
    }).then((data) => {
      assert.equal(web3.toUtf8(data[0]), name, "The user should equal " + name);
      assert.equal(web3.toUtf8(data[1]), email, "email must be equal to " + email);
    });
  });

});
