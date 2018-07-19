
import Url from '../values/url';
import { fetchPosts, fetchGets, receiveResult } from './network';

// Home
export const RECEIVE_NOTICE_LIST = 'RECEIVE_NOTICE_LIST';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';

export const RECEIVE_LIST = 'RECEIVE_LIST';


// Home - 공지사항
export function getNotice() {
  return (dispatch, getState) => {
    return dispatch( fetchPosts(Url.notice.list, {home: true}, RECEIVE_NOTICE_LIST) );
  }
}


// Login - 로그인
export function loginExe(params) {
  return (dispatch, getState) => {
    return dispatch( fetchPosts(Url.login, params, USER_LOGIN) );
  }
}

// Setting - 로그아웃
export function logoutExe(){
  return (dispatch, getState) => {
    return dispatch( receiveResult( USER_LOGOUT, {}) );
  }
}

// 데이터 요청하기
export function requestList(params){
  return ( dispatch, getState ) => {
    return dispatch( fetchGets(Url.list, params, RECEIVE_LIST) );
  }
}



