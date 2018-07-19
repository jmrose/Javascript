
function getQueryString(params){
  var esc = encodeURIComponent;
  return Object.keys(params)
          .map(k=>esc(k)+'='+esc(params[k]))
          .join('&');
}


// post 방식으로 전달
export function fetchPosts(url, params, type){
  console.log(" >>>>>>>>>>> fetchPosts >>>>>>>>>>>> ", url, getQueryString(params));
  return dispatch => {
    return fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded'
          //'Content-Type': 'application/json'
        },
        body: getQueryString(params)
      })
      .then( res => 
        return res.json();
      })
      .then( json => dispatch(receiveResult(type, json)) )
      .catch( (ex) => dispatch(receiveResult(type, {error:ex})) );
  }
}

// get 방식으로 전달
export function fetchGets(url, params, type){
  console.log(" >>>>>>>>>>>>>> fetchGets >>>>>>>>>>>> ", url+'?'+getQueryString(params));
  return dispatch => {
    return fetch(url+'?'+getQueryString(params))
      .then( res => {
        return res.json();
      })
      .then( json => dispatch(receiveResult(type, json)) )
      .catch( (ex) => dispatch(receiveResult(type, {error:ex})) );
  }
}


// store 값 변경
export function receiveResult(type, json){
  return {
    type: type,
    data: json
  }
}
