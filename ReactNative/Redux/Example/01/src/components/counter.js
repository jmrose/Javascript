import React, { Component } from 'react';
import { Container, Content, Text, Card, Header, Body, Button, Title, CardItem } from 'native-base';
import { increment, decrement } from '../actions/index.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class Counter extends Component{
  render(){
    console.log(this.props.count);
    return(
      <Container>
        <Header>
          <Body>
            <Title>Redux Counter</Title>
          </Body>
        </Header>
        <Content padder>
          <Card>
            <CardItem>
              <Text>
                {this.props.count}
              </Text>
            </CardItem>
          </Card>
          <Button dark bordered onPress= {() => this.props.increment()}>
            <Text>Increment</Text>
          </Button>
          <Button dark bordered onPress= {() => this.props.decrement()}>
            <Text>Decrement</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
// store의 state 값을 component의 props에 매핑
function mapStateToProps(state){
  return {
    count:state.count
  }
}

// 컴포넌트의 특정함수형 props를 실행 했을때, 개발자가 지정한 action을 dispath 하도록한다
// bindActionCreators : 첫번째인자 > 액션 생산자인 객체를 받아서 각각의 생산자들은 dispatch 로 감싸서
// 바로 호출 가능하게 만든 객체로 바꿉니다
// let matchDispatchToProps = (dispatch) => {
//  return {
//     increment:()=>dispatch(increment()),
//     decrement:()=>dispatch(decrement())
//  }
// }
function matchDispatchToProps(dispatch){
  return bindActionCreators({increment:increment, decrement:decrement}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Counter);
