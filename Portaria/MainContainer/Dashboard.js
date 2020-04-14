import React, {Component} from 'react'
import {Platform,
        StyleSheet,
        Text,
        View,
        TouchableOpacity,
        Dimensions,
        AppRegistry,
        Image,
        StatusBar,
        ImageBackground,
        FlatList} from 'react-native';
import { ActionConst, Actions } from 'react-native-router-flux';
import {Icon, SearchBar} from 'react-native-elements'

import firebase from "firebase"
import NewRegister from '../MainContainer/NewRegister';
import PeopleList from './FlatList';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Profile from './NewRegister2';


const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
      'Double tap R on your keyboard to reload,\n' +
      'Shake or press menu button for dev menu',
  });

  const FirstRoute = () => (
    // <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />   
    <PeopleList/>
  
  );
  const SecondRoute = () => (
    // <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
    <NewRegister/>
  );
  const ThirdRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#673a0f' }]} />
  );


var {height, width} = Dimensions.get('window');

type Props = {};
export default class Dashboard extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
        deviceWidth: width,
        deviceHeight: height,
        PeoplesData: [], 
        index: 0,
        routes: [
          { key: 'first', icon: 'home' },
          { key: 'second', icon:"add-circle-outline" },
          { key: 'third', icon: 'person' },
      ],
    };
  }

  componentDidMount(){
    this.searchPlaces();
  }
  componentDidUpdate(){
    this.searchPlaces();
  }

  searchPlaces(){
    firebase.database().ref("Peoples/")
    .once("value")
    .then((snapshot)=>{
      const peoplesMaped = _.values(snapshot.val());
      this.setState({PeoplesData: peoplesMaped})
      console.log("render place");
    })
  }

  render() {
    return (
            
      <TabView
        navigationState={this.state}
        renderPager={this._renderPager}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
        useNativeDriver
        tabBarPosition='bottom'
        // initialLayout={{ width: Dimensions.get('window').width }}
        style={styles.scene}
      />

    );
  }


  _handleIndexChange = index => this.setState({ index });

  _renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute
  });
  
  _renderTabBar = props => (
    <TabBar
      {...props}
      renderIndicator={this._renderIndicator}
      renderIcon={this._renderIcon}
      tabStyle={styles.tabbar}
      labelStyle={styles.tabbar}
    />
    
  );

  _renderIcon = ({ route }) => (
    
    <Icon
    name={route.icon}
      size={24}
      style={styles.icon}
      color= 'white'
  />

  );

  renderPlace(item){
    return (
      <TouchableOpacity style={styles.rowView} onPress={()=>{this.openDetails(item)}}>
        <Text>{item.name} - </Text>
        <Image>{item.img}</Image>
      </TouchableOpacity>
      
    )
  }

  logout(){
    firebase.auth().signOut()
    .then(function() {
      // Sign-out successful.
      Actions.login();
    })
    .catch(function(error) {
      // An error happened
    });
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignContent: 'space-between',
    // justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#fff',
    // margin: -20, 
    height: height, 
    width: width
  },
  scene: {
    flex: 1,
    position: 'relative', 
    zIndex: -1
    // justifyContent: 'space-between',    
  },
  icon: {
    // flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'flex-end',
    marginBottom: -100,
    // position: 'absolute'
    padding: -20
  },
  tabbar: {
    flex:1,
    justifyContent: 'space-between',
    alignItems: 'center',
    // textAlign: 'right',
    // height: height * 0.1,
    fontSize: 10,
    // position: 'relative', 
    // alignSelf: 'stretch', 
    marginTop: -3
  },
  backButton: {
    width: 30,
    height: 30,
    borderWidth:0,
    borderColor: 'white',
    borderRadius: 200,
    padding: 4,
    marginTop: 45,
    // marginLeft: 50,
    alignSelf: 'center',    
  },
  titleText:{
    fontSize: 24,
    alignItems: 'flex-start',
    textAlign: 'right',
    color: "white",
    marginTop: 55, 
    // marginBottom: 30,
    marginRight: 110
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: "#23541b",
    borderRadius: 10,
    padding: 10,
    margin: 20,
    width: width * 0.5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontWeight: "bold",
    fontSize: width * 0.05
  }
});
