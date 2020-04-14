/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView} from 'react-native';
import { Actions } from 'react-native-router-flux';
import firebase from "firebase"

var {height, width} = Dimensions.get('window');

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class SignUp extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      deviceWidth: width,
      deviceHeight: height,
      nome: "",
      email: "",
      senha: "",
      cidade: "",
      telefone: "",
      idade: ""
    };
  }

  componentDidMount(){
    const { currentUser } = firebase.auth();
    if (currentUser){
      console.log("Estou logado: ", currentUser.uid)
    }
    //Buscar os dados do usuário logado no banco (depois de ter aprendido a fazer push no banco e criar auth)
  }

  maskTEL(v) {
    return new Promise((resolve, reject) => {
        if(!v){
            resolve("");
            return;
        }
        v = v.replace(/\D/g, "");
        v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
        v = v.replace(/(\d)(\d{4})$/, "$1-$2");
        resolve(v);
    });
}

applyMask(value){
    this.maskTEL(value).then(masked => {
        this.setState({
            phone: masked
        })
    })
}

  render() {
    return (
      <View style={styles.container}>
        {/* <TouchableOpacity onPress={()=> this.backToLogin()} style={styles.backButton} >
          <Text style={styles.buttonText}>Voltar para login</Text>
        </TouchableOpacity>

        <Text style={styles.titleText}>Cadastro de Usuário</Text> */}
        <KeyboardAvoidingView>
        <TextInput
          style={styles.inputStyle}
          onChangeText={(text) => this.setState({nome: text})}
          placeholder="Ex: João Silva"
          value={this.state.nome}
        />
        </KeyboardAvoidingView>
        <KeyboardAvoidingView>
        <TextInput
          style={styles.inputStyle}
          onChangeText={(text) => this.setState({email: text})}
          placeholder="Ex: fulano@gmail.com"
          value={this.state.email}
        />
        </KeyboardAvoidingView>
        <KeyboardAvoidingView>
        <TextInput
          style={styles.inputStyle}
          onChangeText={(text) => this.setState({senha: text})}
          placeholder="Senha aqui"
          keyboardType='numeric'
          secureTextEntry
          value={this.state.senha}
        />
        </KeyboardAvoidingView>
        <KeyboardAvoidingView>
        <TextInput
          style={styles.inputStyle}
          onChangeText={(text) => this.setState({cidade: text})}
          placeholder="Ex: Belo Horizonte"
          value={this.state.cidade}
        />
        </KeyboardAvoidingView>
        <KeyboardAvoidingView>
        <TextInput
          style={styles.inputStyle}
          onChangeText={(text) => this.applyMask(text)}
          placeholder="Telefone"
          maxLength={15}
          keyboardType="numeric"
          value={this.state.phone}
        />
        </KeyboardAvoidingView>
        <KeyboardAvoidingView>
        <TextInput
          style={styles.inputStyle}
          onChangeText={(text) => this.setState({idade: text})}
          placeholder="Ex: 19 anos"
          value={this.state.idade}
        />
        </KeyboardAvoidingView>
        <TouchableOpacity onPress={()=> this.askRegister()} style={styles.registerButton} >
          <Text style={styles.buttonText}>CADASTRAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  backToLogin(){
    Actions.login();
  }

  askRegister(){
    Alert.alert(
      'Registrar',
      'Confirma o seu registo com os seguintes dados?\nNome: ' + this.state.nome + "\nEmail: " + this.state.email ,
      [
        {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => 
          //this.confirmRegister()
          this.registerUser(this.state.email, this.state.senha, this.state.nome, this.state.cidade, this.state.telefone, this.state.idade)
        },
      ],
      { cancelable: false }
    )
  }

  registerUser (email, password, nome, cidade, telefone, idade) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((currentUser) => {
      firebase.database().ref("Users/"+currentUser.user.uid).update({
        uid: currentUser.user.uid,
        email: email,
        nome: nome,
        cidade: cidade,
        telefone: telefone,
        idade: idade
      });
      Alert.alert("Sucesso!", "Usuário criado");
      Actions.pop();
    })
    .catch((error) => { 
      console.log("firebase error: " + error);
      Alert.alert("Errou no auth!", error.code)
    });
  }

  confirmRegister () {
    const userData = {
      nome: this.state.nome,
      email: this.state.email,
      cidade: this.state.cidade,
      telefone: this.state.telefone,
      idade: this.state.idade,
    }
      firebase.database().ref("Users/").push(userData)
      .then((snapshot) => {
        Alert.alert("Sucesso!", "Usuário criado");
        Actions.pop();
      })
      .catch((error) =>{
        console.log("Error: ", error);
        Alert.alert("Errou na persistência!", error.code)
      })
      
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
  backButton: {
    backgroundColor: "gray",
    borderRadius: 10,
    padding: 10,
    margin: 20,
    alignSelf: "flex-start"
  },
  registerButton: {
    borderColor: '#cfcfd0',
    backgroundColor: 'rgba(104, 150, 255, 0.9)',
    borderWidth: 0,
    borderRadius: 0,
    padding: 10,
    margin: 45,
    width: width * 0.75,
    alignItems: 'center'
  },
  buttonText:{
    color: '#fff'
  },
  inputStyle:{
    height: height * 0.06, 
    width: width * 0.85, 
    borderBottomColor: 'gray', 
    borderBottomWidth: 1,
    margin: width * 0.04
  },
  titleText:{
    fontSize: 30,
    alignItems: 'center',
    textAlign: 'center',
    color: "#039BE5"
  }
});
