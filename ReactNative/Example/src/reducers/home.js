import type { Action } from "../actions/types";
import { SET_INDEX, RECEIVE_NOTICE_LIST } from "../actions";

export type State = {
  list: array,
  notice: array
}

const initialState = {
  list: [],
  notice: [],
  selectedIndex: undefined
}

export default function(state: State = initialState, action: Action): State {
  const { data } = action;
  switch( action.type ){
    case SET_INDEX:
      return {
        ...state,
        selectedIndex: action.payload
      }
    case RECEIVE_NOTICE_LIST:
      return {
          ...state,
          notice: data.length > 0 ? data : []
      }
    default:
      return {...state};
  }
}
