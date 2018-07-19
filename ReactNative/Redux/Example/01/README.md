Redux
======


Redux는 Facebook에서 개발한 Flux 아키텍쳐(디자인패턴)를 좀 더 편하게 사용할 수 있도록 해주는 라이브러리다
<br>Mobx는 Redux와 유사한 라이브러리로 Redux보다 접근이 쉽고 Redux보다 빠른 장점을 갖고 있어
<br>간단한 state값 관리에는 Mobx를 활용하는 것이 좋은 대안이 될 수 있을 듯하다.
<br>먼저, Redux 데이터 흐름(the data flow)을 이해하기

<br>
<br>

Redux 데이터 흐름(the data flow)
-------------------------------

### 1. 하나로 묶은 리듀서를 준비한다.

```javascript
##### reducers/counterReducer.js


let count = 0;
export default function(state=count, action){
  switch(action.type){
    case "Increment": count++;
    break;
    case "Decrement": count--;
    break;
  }
  return count;
}

##### reducers/index.js
import {combineReducers} from 'redux';
import countReducer from './countReducer.js';
const allReducers = combineReducers({
  count:countReducer
});
export default allReducers;
```
+ **`combineReducers`** : 모든 리듀서를 하나로 묶는다

<br>
<br>

### 2. 스토어를 준비한다.

```javascript
##### App.js


import React, { Component } from 'react';
import allReducers from './reducers/index.js';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import Counter from './components/counter.js';
const store = createStore(allReducers);
export default class App extends Component{
  render(){
    return(
      <Provider store={store}>
        <Counter />
      </Provider>
    );
  }
}
```
+ **`createStore`** 를 이용하여 스토어를 생성하고 무슨 리듀서를 사용할지 알려준다.
루트컴포넌트(App.js)는 이미 필요한 모든 리듀서를 가지고 있다.
+ 루트컴포넌트는 공급컴포넌트(<Provider>)로 서브컴포넌트(<Counter/>)를 감싸고 스토어(store)와 공급컴포넌트 사이를 연결한다.

<br>
<br>

### 3. 스토어와 공급컴포넌트(Provider) 사이의 커뮤니케이션을 준비한다.
> 공급 컴포넌트는 기본적으로 컴포넌트를 업데이트하기 위한 네트워크를 생성한다. 영민한 컴포넌트는 connect()로 네트워크에 연결한다. 이렇게 상태 업데이트를 받을 수 있게 만든다.

### 4. 액션 콜백(action callback)을 준비한다.
> 우직한 컴포넌트가 액션과 쉽게 일할 수 있게 하기 위해 영민한 컴포넌트는 bindActionCreators()로 액션 콜백을 준비한다. 이렇게 간단히 콜백을 우직한 컴포넌트에 넘겨줄 수 있다. 액션은 포맷이 바뀐 뒤 자동적으로 보내진다.

```javascript
##### components/counter.js

import {increment, decrement} from '../actions/index.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class Counter extends Component {
  render(){
    return (
      <Container>
        <Text>{this.props.count}</Text>
        <Button onPress={()=>this.props.increment()}>
          <Text>Increments</Text>
        </Button>
        <Button onPress={()=>this.props.decrement()}>
          <Text>Decrements</Text>
        </Button>  
      </Container>
    );
  }
}

function mapStateToProps(state){
  return {
    count:state.count
  }
}

// let matchDispatchToProps = (dispatch) => {
//  return {
//     increment:()=>dispatch(increment()),
//     decrement:()=>dispatch(decrement())
//  }
// }
function matchDispatchToProps(dispatch){
  return bindActionCreators({increment:increment,decrement:decrement}, dispatch);
}

//connect 
export default connect(mapStateToProps, matchDispatchToProps)(Counter);
```

+ **`bindActionCreators()`** : 자동으로 액션이 보내진다. 액션 생산자인 객체를 받아서 각각의 생산자들은 dispatch 로 감싸서 바로 호출 가능하게 만든 객체로 바꾼다   _increment:()=>dispatch(increment())이 과정을 자동으로 처리한다_
+ **`connect(mapStateToProps, matchDispatchToProps)`** : connect는 react-redux의 내장 함수이다. 이 항수는 React Component를 Redux Store에 연결해준다.
이 함수의 리턴값은 특정 컴포넌트 클래스의 props를 store의 데이터에 연결시켜주는 또 다른 함수를 리턴한다.
리턴된 함수에 컴포넌트를 인수로 넣어 실행하면, 기존 컴포넌트를 수정하는게 아니라 새로운 컴포넌트를 return 한다.

> * _mapStateToProps(state, [ownProps])**: (Function) store 의 state 를 컴포넌트의 props 에 매핑 시켜준다. ownProps 인수가 명시될 경우, 이를 통해 함수 내부에서 컴포넌트의 props 값에 접근 할 수 있다_
> * _mapDispatchToProps(dispatch, [ownProps]): (Function or Object)  컴포넌트의 특정 함수형 props 를 실행 했을 때, 개발자가 지정한 action을 dispatch 하도록 설정한다. ownProps의 용도는 위 인수와 동일하다_

<br>
<br>
  
```javascript
##### actions/index.js (액션 type 은 필수항목)

export function increment(){
  return { type:"Increment"; };
}

export function decrement(){
  return { type:"Decrement"; };
}
```


<br>
<br>
<br>


* * * *
###### 참조문서 : 
+ [http://bestalign.github.io/2015/10/26/cartoon-intro-to-redux/](http://bestalign.github.io/2015/10/26/cartoon-intro-to-redux/)
+ [https://velopert.com/1266](https://velopert.com/1266)
+ [https://docs.nativebase.io/docs/examples/ReduxCounterExample.html](https://docs.nativebase.io/docs/examples/ReduxCounterExample.html)

