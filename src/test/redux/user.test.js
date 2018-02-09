import toBeType from "jest-tobetype";
expect.extend(toBeType);
import * as reducer from '../../redux/index.js';
import { loginActions, LOGIN } from '../../redux/user.js';

const mock = {
  loggedInUser: {
    name: 'Zach', 
    email: 'zach@test.com',
    username: 'zshaw'
  }
}


describe('User duck', () => {
  const initState = {
    data: null,
    fetchedUsers: []
  };

  describe("[Reducer] - user", () => {
    it('Should be a function', () => {
      expect(reducer.user).toBeType('function');
    })

    it('Should initialize with correct state', () => {
      const state = reducer.user(initState, {});
      const expected = { data: null, fetchedUsers: [] };
      expect(state).toEqual(expected)
    })
  })

  describe('[Action] - loginUserSuccess', () => {
    it('Should be a function', () => {
      expect(loginActions.success).toBeType('function');
    })

    it('Should return an action of type ticketchain/login/login/success', () => {
      expect(loginActions.success()).toHaveProperty('type', `${LOGIN}/success`)
    })

    it('should assign the first agument to the payload property', () => {
      expect(loginActions.success(mock.loggedInUser)).toHaveProperty('payload', mock.loggedInUser);
    })

    it('should update state', () => {
      const state = reducer.user(initState, loginActions.success(mock.loggedInUser));
      expect(state.data).toEqual(mock.loggedInUser);
    })
  })
})
