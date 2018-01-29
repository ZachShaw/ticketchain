const initialState = {
  data: []
}

const ticketReducer = (state = initialState, action) => {
  if (action.type === 'STORE_TICKETS') {
    return { 
      ...state, 
      data: action.payload 
    }
  }
  return state
}

export default ticketReducer;

