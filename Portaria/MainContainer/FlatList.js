/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { ActionConst, Actions } from 'react-native-router-flux';
import firebase from "firebase"
import _ from "lodash"
import { Icon, List, ListItem, SearchBar, Avatar } from 'react-native-elements'

var { height, width } = Dimensions.get('window');

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

this.arrayholder = [];

type Props = {};
export default class PeopleList extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      deviceWidth: width,
      deviceHeight: height,
      peopleData: [],
      loading: false,
      data: [],
      error: null,
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();

  }

  // searchPeople() {
  //   firebase.database().ref("Peoples")
  //     .once("value")
  //     .then((snapshot) => {
  //       const peopleMaped = _.values(snapshot.val());
  //       this.setState({ peopleData: peopleMaped});
  //     })
  // }

  searchFilterFunction = text => {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.name.toLowerCase()}   
      ${item.city.toLowerCase()}`;
      const textData = text.toLowerCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({ peopleData: newData });
  };

  makeRemoteRequest = () => {
    this.setState({ loading: true });
    firebase.database().ref("Peoples")
      .once("value")
      .then((snapshot) => {
        const peopleMaped = _.values(snapshot.val());
        this.setState({
          peopleData: peopleMaped,
          error: peopleMaped.error || null,
          loading: false,
        });
        this.arrayholder = peopleMaped;
      })
      .catch(error => {
        this.setState({ error, loading: false });
        console.log('Erro')
      });

  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      // <View style={styles.container}>

      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, marginTop: -3 }}>
        <FlatList
          data={this.state.peopleData}
          renderItem={({ item }) => (this.renderPeople(item))}
          keyExtractor={item => item.name}
          ListHeaderComponent={this.renderHeader}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </List>
      // </View>
    );
  }


  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Pesquisar nome ou cidade..."
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        containerStyle={styles.searchBar}
      />
    );
  };

  renderPeople(item) {
    return (
      <View style={styles.rowView}>
        {/* <TouchableOpacity style={styles.rowView} onPress={() => { this.openDetails(item) }}> */}
        <ListItem
          roundAvatar
          title={item.name}
          subtitle={item.city}
          avatar={(<Avatar
            size={30}
            rounded
            // source={item.picProfile}
            icon={{ name: 'user', type: 'font-awesome' }}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
            containerStyle={{ margin: 3, position: 'relative' }}
          />)}
          containerStyle={{ borderBottomWidth: 0 }}
          rightIcon={
            <TouchableOpacity onPress={() => { this.goToDashboard(item.uid) }}>
              <Icon color='#6896ff' name='edit' size={24} />
            </TouchableOpacity>
          }
        />

        {/* <Avatar
            size={30}
            rounded
            // source={item.picProfile}
            icon={{ name: 'user', type: 'font-awesome' }}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
            containerStyle={{ margin: 3, position: 'relative' }}
          />
          <Text style={styles.welcome}>{item.name} - </Text>
          <Text style={styles.instructions}>{item.city}</Text>
          <Text style={styles.instructions}> Entrada:9:00</Text>

          <TouchableOpacity style={styles.icone} onPress={() => { this.goToDashboard(item.uid) }}>
            <Icon color='#6896ff' name='edit' size={24} />
          </TouchableOpacity> */}
        {/* </TouchableOpacity> */}

      </View>


    )
  }

  openDetails(people) {
    Actions.placeDetails({ people: people })
  }

  goToDashboard() {
    Actions.dashboard();
  }


}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // overflow: 'hidden',
    // backgroundColor: '#F5FCFF',
    height: height * 0.89,
    // bottom: 15,
    // marginTop: 15,
    width: width,
    position: 'absolute',
    // maxWidth: width * 0.98,

  },
  searchBar: {
    // flex: 1,
    // backgroundColor: 'transparent',
    // borderColor: 'transparent',
    // width: width,
    // height: height * 0.80,
    justifyContent: 'center',
    // margin: -4
    // marginLeft: 5,
    // marginBottom: -5,
    // paddingBottom: -5
    // alignItems: 'center',
    // textAlign: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'right',
    justifyContent: 'flex-start'
    // margin: 10,
  },
  instructions: {
    textAlign: 'right',
    color: '#333333',
    // marginBottom: 5,
    // marginLeft: 50,
    // justifyContent: 'flex-start',
    // alignItems: 'center'
  },
  loginButton: {
    backgroundColor: "#23541b",
    borderRadius: 10,
    padding: 10,
    margin: 20,
    width: width * 0.8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontWeight: "bold",
    fontSize: width * 0.05
  },
  rowView: {
    flex: 1,
    // flexDirection: "row",
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // // textAlign: 'right',
    // width: width,
    // maxWidth: width * 0.98,
    // margin: 3,
    height: height * 0.1,
    // marginTop: -0,
    // // position: 'relative',
    // // marginBottom: -15, 
    // // paddingBottom: -20
    // borderBottomWidth: 1,
    // borderLeftColor: 'gray',
  },
  icone: {
    // flex: 1,
    flexDirection: "column",
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    // width: width,
    // marginTop: -20,
    marginLeft: 5,
    // position: 'relative',
    borderLeftWidth: 1,
    borderLeftColor: 'gray',
  },
  titleText: {
    flexDirection: 'row',
    fontSize: 20,
    alignItems: 'flex-end',
    textAlign: 'left',
    color: "#039BE5"
  }
});
