import AuthenticationContract from '../../../build/contracts/Authentication.json'
import store from '../../store'

const contract = require('truffle-contract')

export function fetchUser(address) {
  let web3 = store.getState().web3.web3Instance
  
  if (typeof web3 !== 'undefined') {
    return new Promise((resolve, reject) => {

      const authentication = contract(AuthenticationContract)
      authentication.setProvider(web3.currentProvider)
      var authenticationInstance

      authentication.deployed().then((instance) => {
        authenticationInstance = instance;

        return authenticationInstance.getUser(address).then((user) => {
          const utfUser = {
            name: web3.toUtf8(user[0]),
            email: web3.toUtf8(user[1]),
            username: web3.toUtf8(user[2]),
          }
          return resolve(utfUser);
        }).catch((error) => reject(error));
      });

    });

  }
}