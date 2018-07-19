import type { Action } from '../actions/types';
import { REQUEST_JOIN, RECEIVE_JOIN, ERROR_LOADING_JOIN } from '../actions/join';

export type State = {
    join:array,
    done:bool,
    error:object
}

const initialState = {
  join: [],
  done: false,
  error: {
    state: false,
    message: ""
  }
}

export default function (state:State = initialState, action:Action): State {
  switch(action.type){
    case REQUEST_JOIN:
      return {
        join: action.result
      };
    case RECEIVE_JOIN:
      return action.join;
    case ERROR_LOADING_JOIN:
      return state;
    default:
      return state;
  }
}
