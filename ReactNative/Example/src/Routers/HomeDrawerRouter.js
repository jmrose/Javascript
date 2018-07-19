

// screenProps : 하위 Navigation에 부모 네비게이션 정보를 넘겨줄때 설정해서 사용한다

import React, { Component } from "react";
import Home from "../components/home/";
import list from "../components/list/";
import Search from "../components/search/";
import Setting from "../components/setting/";

import { DrawerNavigator, StackNavigator } from "react-navigation";

import DrawBar from "../components/drawerbar";

export default ( DrawNav = DrawerNavigator(
  {
    Home: { screen: Home },   
    list: { screen: ({navigation, screenProps}) => <Bids screenProps={{parentNavigation:navigation, ...screenProps}} /> },
    Search: { screen: Search },
    Setting: { screen: Setting }
  },
  {
    contentComponent: props => <DrawBar {...props} />
  }
));
