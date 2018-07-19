import React, { Component } from "react";
import PropTypes from 'prop-types';
import {
  Platform,
  Animated,
  Dimensions,
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
  View,
  Text,
  Button
} from "react-native";
import { Icon } from 'native-base';

const { height, width } = Dimensions.get("window");

class Fab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
    }
  }

  componentWillReceiveProps(nextProps){
    if( nextProps.scrolling ){
      Animated.timing(                  // Animate over time
        this.state.fadeAnim,            // The animated value to drive
        {
          toValue: 1,                   // Animate to opacity: 1 (opaque)
          duration: 1000,              // Make it take a while
        }
      ).start();
    }else{
      Animated.timing(                  // Animate over time
        this.state.fadeAnim,            // The animated value to drive
        {
          toValue: 0,                   // Animate to opacity: 1 (opaque)
          duration: 1000,              // Make it take a while
        }
      ).start();
    }
  }

  render() {
    const { props: { active, style} } = this;

    return (
      <Animated.View style={[styles.container,{opacity:this.state.fadeAnim}]} {...style}>
        <TouchableOpacity
          onPress={() => this.props.onPress()}
          activeOpacity={1}
        >
          <View style={styles.button}>
            <Icon name='md-download' style={{color:'#777',transform:[{rotate:'180deg'}]}} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: undefined,
    bottom: 20,
    left: undefined,
    right: 20,
    zIndex: 3,
    elevation: 3
  },
  button: {
    backgroundColor:'rgba(204,204,204,0.6)',
    borderColor:'#ccc',
    borderWidth:1,
    paddingVertical:5,
    paddingHorizontal:15
  }
});

export default Fab;
