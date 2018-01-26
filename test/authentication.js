/* eslint-disable */
let Authentication = artifacts.require("./Authentication.sol");

contract('Authentication', (accounts) => {

  it("...should sign up and log in a user.", () => {
    return Authentication.deployed().then((instance) => {
      authenticationInstance = instance;

      return authenticationInstance.signup('testuser', {from: accounts[0]});
    }).then(() => {
      return authenticationInstance.login.call();
    }).then((userName) => {
      assert.equal(web3.toUtf8(userName), 'testuser', "The user was not signed up.");
    });
  });

});
