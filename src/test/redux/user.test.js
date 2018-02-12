import toBeType from "jest-tobetype";
expect.extend(toBeType);
import * as reducer from '../../redux/index.js';
import { loginActions, LOGIN, logout, LOGOUT } from '../../redux/user.js';

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

  describe('[Action] - loginUserError', () => {
    it('Should be a function', () => {
      expect(loginActions.error).toBeType('function');
    })

    it('Should return an action of type ticketchain/login/login/success', () => {
      expect(loginActions.error()).toHaveProperty('type', `${LOGIN}/error`)
    })

    it('should not update state', () => {
      const state = reducer.user(initState, loginActions.error());
      expect(state.data).toEqual(initState.data);
    })
  })

  describe('[Action] - logoutUser', () => {
    it('Should be a function', () => {
      expect(logout).toBeType('function');
    })

    it('Should return an action of type ticketchain/login/logout', () => {
      expect(logout()).toHaveProperty('type', LOGOUT)
    })

    it('should log the user out', () => {
      const state = reducer.user(initState, loginActions.success(mock.loggedInUser));
      const newState = reducer.user(state, logout());
      expect(newState.data).toEqual(initState.data);
    })
  })
})
