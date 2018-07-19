import type { Action } from '../actions/types';
import { RECEIVE_LIST } from "../actions";

export type State = {
  list: array,
  error: string
}

const initialState = {
  list: [],
  error: ''
};

export default function (state:State = initialState, action:Action): State {
  const { data } = action;
  switch(action.type){
    case RECEIVE_LIST:
      if(data.error){
        return{
          ...state,
          error: data.error
        }
      }else{
        return {
          ...state,
          list: data.params.page != "1" ? [...state.list, ...data.list] : data.list,
          params: data.params,
          done: data.done,
          error: ''
        }
      }
    default:
      return state;
  }
}
