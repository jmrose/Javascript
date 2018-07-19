# ReactNative-Tutorials


리액트 네이티브는 페이스북에서 개발한 iOS와 안드로이드에서 동작하는 네이티브 모바일 애플리케이션을 만드는 
자바스크립트 프레임워크다. iOS와 안드로이드에 동시에 배포할 수 있는 장점을 갖고 있어 이번 프로젝트에 
리액트 네이티브를 도입하기로 하였다.

<br>영속적 데이터베이스 관리로는 가벼운 React Native AsyncStorage와 Realm을 사용하기로 하였다.
<br>프로젝트 개발 중 가장 큰 관심사는 퍼포먼스와 서드파티 활용이다.


### 사용된 라이브러리
+ [NativeBase](https://nativebase.io/) or [ReactNativeElement](https://github.com/react-native-training/react-native-elements) - bootstrap과 같이 ReactNative를 위한 오픈소스 UI컴포넌트 라이브러리
   - 참조 : https://github.com/start-react/native-starter-kit
+ [ReactNativeVectorIcons](https://github.com/oblador/react-native-vector-icons) - NativeBase 의존적인 라이브러리로 vector icon 제공 [icon-all](https://oblador.github.io/react-native-vector-icons/)
+ Redux or Mobx - Facebook에서 개발한 Flux 아키텍쳐(디자인패턴)를 좀 더 편하게 사용할 수 있도록 해주는 라이브러리
+ ReduxForm
+ ReactNativeRouterFlux or ReactNavigation - react-navigation 에 기반을 둠
+ ReactThunk - 비동기 미들웨어
+ ReduxPersis - Store 관리 라이브러리
+ [Realm](https://realm.io/kr/docs/) - 모바일 데이터베이스(로컬스토리)로 데이터 영속성을 사용하기 쉬운 API로 제공해주며, SQLite보다 처리
가 빨라 구글에서도 채택함 ( React Native AsyncStorage, SQLite, Realm Database )


### 1. 프로젝트 생성
<pre>
$ react-native init AppName
$ cd AppName
$ yarn add native-base
$ yarn add redux react-redux
</pre>



### 2. Git 등록
<pre>
$ git init
$ git remote add origin https://github.com/dev-cp/AppName.git
</pre>



### 3. [Vector Icon](https://github.com/oblador/react-native-vector-icons) 등록
### 4. [Customize Theme](https://docs.nativebase.io/Customize.html#theaming-nb-headref) 설정


### 5. 학습내용
+ Redux - 자세히보기 [https://github.com/jmrose/ReactNative_redux](https://github.com/jmrose/ReactNative_redux)
