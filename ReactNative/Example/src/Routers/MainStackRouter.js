import React, { Component } from "react";

import Home from './HomeDrawerRouter';
import Join from '../components/join/';
import Guide from '../components/guide/';
import Login from '../components/login/';
import Search from '../components/search/';
import { StackNavigator } from 'react-navigation';

Home.navigationOptions = ({ navigation }) => ({
  header: null
});

export default ( StackNav = StackNavigator({
  Guide: { screen: Guide },
  Home: { screen: Home },
  Join: { screen: Join },
  Login: { screen: Login }
},{
  initialRouteName: 'Home'
}));
