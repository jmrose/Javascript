
import type { Action } from '../actions/types';
import { SET_USER } from '../actions/user';

export type State = {
  userid: string
}

const initialState = {
  userid: 'devinfo',
};

export default function (state:State = initialState, action:Action): State {
  if (action.type === SET_USER) {
    return {
      ...state,
      userid: action.payload,
    };
  }
  return state;
}
