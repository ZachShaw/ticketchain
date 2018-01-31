/* eslint-disable */
let Authentication = artifacts.require("./Authentication.sol");

contract('Authentication', (accounts) => {
  let name = 'Zach Shaw';
  let email = 'zach@gmail.com';
  let username = 'zshaw'

  it("should sign up and log in a user.", () => {
    return Authentication.deployed().then((instance) => {
      authenticationInstance = instance;

      return authenticationInstance.signup(name, email, username, {from: accounts[0]});
    }).then(() => {
      return authenticationInstance.login();
    }).then((data) => {
      assert.equal(web3.toUtf8(data[0]), name, "The user should equal " + name);
      assert.equal(web3.toUtf8(data[1]), email, "email must be equal to " + email);
      assert.equal(web3.toUtf8(data[2]), username, "username must be equal to " + username);
    });
  }),

  it("should retrieve users details", () => {
    return Authentication.deployed().then((instance) => {
      authenticationInstance = instance;

      return authenticationInstance.getUser(accounts[0]);
    }).then((data) => {
      assert.equal(web3.toUtf8(data[0]), name, "The user should equal " + name);
      assert.equal(web3.toUtf8(data[1]), email, "email must be equal to " + email);
      assert.equal(web3.toUtf8(data[2]), username, "username must be equal to " + username);
    })
  })

});
