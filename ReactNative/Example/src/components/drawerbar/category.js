import React, {Component} from 'react'
import {
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
  Text,
  View
} from 'react-native';
import styles from './styles';
import { Icon } from "native-base";

class Category extends Component{
  render(){
    const children = Platform.OS === 'ios'
      ? this.props.children
      : React.Children.map(this.props.children, child => child.type === Text ? React.cloneElement(child, {capitalize:true, ...child.props}) : child);

    if ( Platform.OS === 'ios' || Platform['Version'] <= 21 ){
      return (
        <TouchableHighlight ref={c => this._root = c}>
          {children}
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableNativeFeedback
          ref={c => this._root = c}
          background={TouchableNativeFeedback.SelectableBackground()}
          onPress={this.props.onPress}>
          <View style={(this.props.selected=='active'?styles.atcontainer:styles.container)}>
            <Icon style={(this.props.selected=='active'?styles.aticon:styles.icon)} name={this.props.iconnm} />
            <Text style={(this.props.selected=='active'?styles.attext:styles.text)}>{this.props.text}</Text>
          </View>
        </TouchableNativeFeedback>
      );
    }
  }
}

export default Category;
