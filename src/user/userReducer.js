const initialState = {
  data: null
}

const userReducer = (state = initialState, action) => {
  if (action.type === 'USER_LOGGED_IN' || action.type === 'USER_UPDATED')
  {
    return { ...state, data: action.payload }
  }

  if (action.type === 'USER_LOGGED_OUT')
  {
    return { ...state, data: null }
  }

  return state
}

export default userReducer
