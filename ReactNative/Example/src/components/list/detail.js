import React, {Component} from "react";
import {WebView, ActivityIndicator, View, AsyncStorage, Platform, BackHandler, LayoutAnimation, NativeModules, Animated} from "react-native";
import {
    Container,
    Content,
    Header,
    Left,
    Body,
    Right,
    Title,
    Button,
    Icon
} from "native-base";
import url from '../../values/url';
import styles from './styles';
import Toast from '../utils/toast';
import customerTheme from '../../../native-base-theme/variables/customer';
const { UIManager } = NativeModules;

// LayoutAnimation
// UIManager.setLayoutAnimationEnabledExperimental &&
//   UIManager.setLayoutAnimationEnabledExperimental(true);

// ios postMessage 에러대응코드
const patchPostMessageJsCode = `(${String(function() {
    var originalPostMessage = window.postMessage;
    var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
    }
    patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    }
    window.postMessage = patchedPostMessage;
})})();`

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailUrl: '',
            id: null,
            loading: true,
            canGoBack: false,
            height: new Animated.Value(0)
        }
        this.userInfo = {};
    }

    componentWillMount() {
        if (Platform.OS === 'android') BackHandler.addEventListener('hardwareBackPress', this.onBack);
        const {params} = this.props.navigation.state;
        AsyncStorage.getItem('reduxPersist:user').then((value) => {
            if (value) {
                this.userInfo = JSON.parse(value);
            }
            let detailUrl = url.detail;
            detailUrl = detailUrl + '?id=' + params.id + '&deviceid=' + this.userInfo.deviceid;
            this.setState({detailUrl: detailUrl, id: params.id});
        });
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }

    postMessage = (action) => {
        this.webView.postMessage(JSON.stringify(action));
    }

    onMessage = (event) => {
        let datas = event.nativeEvent.data.split('|');
        if (datas[0] == 'scroll') {  // 스크롤 시 ios 제외 - ios는 스크롤이 멈췄을 때만 값을 받아옴
            if (Platform.OS === 'ios') return;
            if (parseInt(datas[1]) > 1 && this.state.height._value == 0) {
                // LayoutAnimation.easeInEaseOut();
                // this.setState({height: 0});
                Animated.timing(this.state.height, {
                    toValue: 1,
                    duration: 200,
                }).start();
            } else if (parseInt(datas[1]) <= 1 && this.state.height._value == 1) {
                // LayoutAnimation 버그 - 스크롤을 왔다갔다 하면 하얗게 변함 ㅜㅜ
                // LayoutAnimation.easeInEaseOut();
                // this.setState({height: customerTheme.toolbarHeight});
                Animated.timing(this.state.height, {
                    toValue: 0,
                    duration: 200,
                }).start();
            }
        }
    }

    onNavigationStateChange = (navState) => {
        this.setState({
            canGoBack: navState.canGoBack,
            currentUrl: navState.url
        });
    }

    onBack = (navBack = false) => {
        if (navBack) {  // 상단 헤더 뒤로가기 시 무조건 종료
            const {params} = this.props.navigation.state;
            this.props.navigation.goBack(null);
        } else if (this.state.canGoBack && (this.state.currentUrl.indexOf('/detail') === -1)) { // 상세페이지가 아니면 history back
            this.webView.goBack();
        } else {    // 상세페이지면 종료
            const {params} = this.props.navigation.state;
            this.props.navigation.goBack(null);
        }
        return true;
    }

    onLoadStart = () => {
        // ios에서 스크롤 시 onLoadStart가 타는 문제 - onLoadEnd는 안탐
        // 그래서 안드로이드만 true로 바꿔줌 - 초기 설정 true라 ios도 처음은 로딩 보임
        if (Platform.OS === 'android') this.setState({loading: true});
    }

    onLoadEnd = () => {
        this.setState({loading: false});
    }

    renderLoading = () => {
        if (this.state.loading) {
            return (
                <View style={{position: 'absolute',top: 0,left: 0,right: 0,bottom: 0}}>
                    <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
                        <ActivityIndicator style={{height: 100}} size='large' color='#4179F7' animating={true} hidesWhenStopped={true}/>
                    </View>
                </View>
            );
        }
    }

    render() {
        const heightAction = [{
			height: this.state.height.interpolate({
				inputRange: [0, 1],
				outputRange: [customerTheme.toolbarHeight, 0],
				extrapolate: 'clamp',
			}),
            opacity: this.state.height.interpolate({
				inputRange: [0, 1],
				outputRange: [1, 0],
				extrapolate: 'clamp',
			}),
			transform: [{ translateY: this.state.height.interpolate({
				inputRange: [0, 1],
				outputRange: [0, -customerTheme.toolbarHeight],
				extrapolate: 'clamp',
			})}]
		}];
        return (
            <Container style={styles.container}>
                <Animated.View style={heightAction}>
                    <Header>
                        <Left>
                            <Button transparent onPress={this.onBack}>
                                <Icon name="md-arrow-round-back"/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>{this.state.title}</Title>
                        </Body>
                        <Right/>
                    </Header>
                </Animated.View>
                <WebView
                    ref={x => {this.webView = x}}
                    onNavigationStateChange={this.onNavigationStateChange}
                    source={{uri: this.state.detailUrl}}
                    onLoadStart={this.onLoadStart}
                    onLoadEnd={this.onLoadEnd}
                    onMessage={this.onMessage}
                    injectedJavaScript={patchPostMessageJsCode}
                />
                <Toast ref="toast" />
                {this.renderLoading()}
            </Container>
        );
    }
}

export default Detail;
