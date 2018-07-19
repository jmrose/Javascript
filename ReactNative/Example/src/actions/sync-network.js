
function getQueryString(params){
  var esc = encodeURIComponent;
  return Object.keys(params)
          .map(k=>esc(k)+'='+esc(params[k]))
          .join('&');
}

export function fetchPosts(url, params){
  // console.log(" >>>>>>>>>>> fetchPosts >>>>>>>>>>>> ", url, getQueryString(params));
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded'
      //'Content-Type': 'application/json'
    },
    body: getQueryString(params)
  });
}

export function fetchGets(url, params){
  // console.log(" >>>>>>>>>>>>>>>>>>>> fetchGets >>>>>>>>>>>> ", url+'?'+getQueryString(params));
  return fetch(url+'?'+getQueryString(params));
}
