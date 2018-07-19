import type { Action } from './types';

export const REQUEST_JOIN = 'REQUEST_JOIN';
export const RECEIVE_JOIN = 'RECEIVE_JOIN';
export const ERROR_LOADING_JOIN = 'ERROR_LOADING_JOIN';

function getQueryString(params){
  var esc = encodeURIComponent;
  return Object.keys(params)
          .map(k=>esc(k)+'='+esc(params[k]))
          .join('&');
}

function fetchPosts(params){
  console.log('=======fetchPosts========================>', params);
    return dispatch => {
      return fetch('/mobile/join?'+getQueryString(params))
        .then( res => res.json() )
        .then( json => dispatch(receiveJoin(json)) )
        .catch( (ex) => dispatch({type:ERROR_LOADING_JOIN, error:ex.error}) );
    }
}

export function requestJoin(params){
  console.log( 'join----------requestJoin-----------> ', '/mobile/join?'+getQueryString(params));

  return (dispatch, getState) => {
    return dispatch(fetchPosts(params));
  }
}

export function receiveJoin(json){
  console.log( 'join--------receiveJoin----------->', json.result);
  return {
    type: RECEIVE_JOIN,
    join: json.result,
    done: true
  }
}
