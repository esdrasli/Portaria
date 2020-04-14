import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    AppRegistry,
    Image,
    StatusBar,
    ImageBackground,
    FlatList, 
    KeyboardAvoidingView, 
    TextInput, 
    Alert
} from 'react-native';
import { ActionConst, Actions } from 'react-native-router-flux';
import {Icon} from 'react-native-elements'
import firebase from 'firebase'

import BG from '../assets/BG.png'
import Logo from '../assets/Logo.png'

var { height, width } = Dimensions.get('window');
type Props = {};

export default class Login extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            senha: '123456',
            email: 'bobysk8@gmail.com',
            deviceWidth: width,
            deviceHeight: height
        };
    }

    compenetDidMount() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log("current user");
                console.log(JSON.stringify(user))
                if (user) {
                    Actions.dashboard();
                }
            } else {
                // console.log("current user");
                // console.log(JSON.stringify(user))
            }
        })
    }

    render() {

        return (
            <ImageBackground source={BG} style={styles.BG}>

                {/* <View style={styles.container}> */}

                    <Image source={Logo} style={styles.logoStyle}  />
                    <View style={styles.viewInput}>

                        <Icon color='white' name='mail' underlayColor='gray' size={18} />
                        <KeyboardAvoidingView>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => this.setState({ email: text })}
                                placeholder="Ex: fulano@gmail.com"
                                value={this.state.email}
                                placeholderTextColor="#fff"
                                keyboardType="email-address"
                                underlineColorAndroid='transparent'
                            />
                        </KeyboardAvoidingView>
                    </View>
                    <View style={styles.viewInput}>

                        <Icon name='lock' size={18} color='#fff' />
                        <KeyboardAvoidingView enabled>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => this.setState({ senha: text })}
                                placeholder="Senha"
                                secureTextEntry
                                // keyboardType="number-pad"
                                value={this.state.senha}
                                placeholderTextColor="#fff"
                            // underlineColorAndroid='transparent'
                            />
                        </KeyboardAvoidingView>
                    </View>
                    <TouchableOpacity onPress={() => this.loginUser( this.state.email, this.state.senha)} style={styles.askButton} >
                        <Text style={styles.buttonText}>LOGIN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.goToSignUp()} style={styles.askButton2} >
                        <Text style={styles.buttonText}>CADASTRO</Text>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.askForgotPassword()} >
                        <Text style={styles.buttonText}>Esqueceu a senha?</Text>
                    </TouchableOpacity>

                    {/* <Image style={styles.logoUFMG} source={UFMG} /> */}

                {/* </View> */}

            </ImageBackground>
        );
    }

    askForgotPassword(){
        if (this.state.email == ""){
          Alert.alert("Erro", "Você precisa informar o seu e-mail");
        }
        else {
          Alert.alert(
            'Recuperar senha',
            'Deseja realmente recuperar a senha do e-mail?\n' + this.state.email + '?',
            [
              {text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => 
                this.resetPassword() 
    
              },
            ],
    
            { cancelable: false }
          )
        }
      }
    
      resetPassword(){
        var auth = firebase.auth();
        var emailAddress = this.state.email;
        auth.sendPasswordResetEmail(emailAddress).then(function(){
          Alert.alert("Sucesso!!","email de recuperacao enviado")
        })
      }
    
      loginUser(email, password){
        //Alert.alert("Confirmar dados", "Verifique se os dados estão corretos.\nEmail: " + email + "\nSenha: "+ password);
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then ((dadosUsuario)=> {
          //Alert.alert("Sucesso!");
          Actions.dashboard();
        })
        .catch(function(error) {
          // Handle Errors here.
          if (error.code == "auth/user-not-found"){
            Alert.alert("Atenção!", "Usuário não encontrado");
          }
          else {
            Alert.alert("Atenção!", "Procure o dev e brigue com ele pq você não sabe sua senha.");
          }
          //Alert.alert("Errou!!", "Código: " + error.code + "\nMensagem: " + error.message);
          // ...
        });
      }

      goToSignUp(){
          Actions.signUpbobysk8();
      }

}

const styles = StyleSheet.create({
    BG: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        // opacity: 0.5,
        width: width
    },
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    },
    mainButton: {
        backgroundColor: "#4f8942",
    },
    textButton: {
        color: "white",
        margin: 20
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },

    instructions: {
        textAlign: 'center',
        color: 'red',
        marginBottom: 5,
    },
    askButton: {
        //backgroundColor: "green",
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 0,
        padding: 10,
        margin: 5,
        width: width * 0.75,
        alignItems: 'center'
    },
    askButton2: {
        //backgroundColor: "#039BE5",
        borderColor: 'white',
        borderWidth: 1,
        // borderRadius: 25,
        padding: 10,
        margin: 10,
        width: width * 0.75,
        alignItems: 'center'
    },
    buttonText: {
        color: "white"
    },
    welcomeText: {
        color: "gray",
        fontSize: 38,
        alignItems: "center",
        textAlign: 'center'
    },
    logoStyle: {
        marginBottom: 30,
        width: 180,
        height: 180,
    },
    logoUFMG: {
        marginTop: 50,
        
    },
    titleText: {
        fontSize: 30,
        alignItems: 'center',
        textAlign: 'center',
        color: "#039BE5"
    },
    meuBotao: {
        backgroundColor: 'green',
        width: width * 0.8,
        height: width * 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    estiloTexto: {
        color: '#ffffff',
        textAlign: 'center',
        alignItems: 'center'
    },
    inputStyle: {
        height: height * 0.06,
        width: width * 0.85,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        // margin: width * 0.04, 
    },
    viewInput: {
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: 'blue',
        width: width * 1,
        marginLeft: 10,
    },
    input: {
        width: width - 90,
        height: 40,
        borderRadius: 0,
        fontSize: 16,
        paddingLeft: 25,
        // backgroundColor:'rgba(255,255,255,0.35)',
        color: 'white',
        margin: 5,
        // marginTop: 20,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        marginLeft: -20,
        //marginHorizontal:-27,
    },
    inputIcon: {
        position: 'absolute',
        top: 8,
        left: 35,
    },
    logoContainer: {
        alignItems: 'center'
    },
    Text: {
        color: 'white',
        alignItems: 'center',
        // justfyContet: 'center',
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'white',
    },
    TextInput: {
        borderWidth: 1,
        // borderStyle: 1,
        // borderColor: 'white'
    }
});
