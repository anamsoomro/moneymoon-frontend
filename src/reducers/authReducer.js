

const initialState = {
  user: null,
  account_id: null,
}

export default function authReducer(state=initialState, action){
  // debugger
  switch(action.type){
    case 'setCurrentUser':
      return{ ...state,
        user: {
          username: action.user.username, 
          user_id: action.user.user_id,
        },
        account_id: action.user.account_id
      }
    case 'clearCurrentUser':
      return{
        ...state,
        user: null,
        account_id: null
      }
    default: {
      return state
    }
  }
}