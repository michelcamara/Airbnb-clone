import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StatusBar, AsyncStorage } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

import api from '../../services/api';

import{
  Container,
  Logo,
  Input,
  ErrorMessage,
  Button,
  ButtonText,
  SignUpLink,
  SignUpLinkText
} from './styles';

export default class SingIn extends Component{
  static navigationOptions = {
    header: null;
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      dispatch: PropTypes.func,
    }).isRequired,
  };
  
  state= {email:'', password:'', error:''}
  //quando o usuário estiver digitando algo no campo de email, a handleEmailChange, 
  //ela apenas irá recuperar um parâmetro e guardá-lo na variável email do state
  handleEmailChange = (email) => {
    this.setState({ email });
  };
  //handlePasswordChange e ao invés de guardar um valor no o email ela irá guardar no password
  handlePasswordChange = (password) =>{
    this.setState({ password });
  };
  //irá navegar para a tela de cadastro, ela irá usar o método navigate que está 
  //disponível nas props do componente graças ao React Navigation
  handleCreateAccountPress = () =>{
    this.props.navigate('SignUp');
  };

  //é a responsável pela comunicação com a API e dar um resultado de sucesso ou erro para o Login
  //função assíncrona, no seu escopo a primeira linha é uma verificação para que o usuário não consiga enviar uma 
  //requisição para a API sem preencher os 2 campos, caso algum deles não esteja preenchido é setado uma mensagem de erro.
  handleSignInPress = async () => {
    //Campos nao preenchidos
    if (this.state.email.length === 0 || this.state.password.length === 0) {
      this.setState({ error: 'Preencha usuário e senha para continuar!' }, () => false);
    } 
    //Caso os campos tenham sido preenchidos irá entrar no bloco do else, que logo 
    //no começo temos um try/catch pois vamos usar requisições HTTP de forma assíncrona, 
    //portanto precisamos de uma maneira de tratar os possíveis erros
    else {
      //LER NO BLOCO ANOTACOES.TXT
      try {
        const response = await api.post('/sessions', {
          email: this.state.email,
          password: this.state.password,
        });
          
        await AsyncStorage.setItem('@AirBnbApp:token', response.data.token);

        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Main' }),
          ],
        });
        this.props.navigation.dispatch(resetAction);
      }
      //caso haja um erro é setar uma mensagem de erro no state também
      catch (_err) {
        this.setState({ error: 'Houve um problema com o login, verifique suas credenciais!' });
      }
    }
  };

  render(){
    return(
      <Container>
        <StatusBar hidden/>
        <Logo  source={require('../../images/airbbnb_logo.png')} resizeMode="contain" />
        <Input
          placeHolder = "Endereço de e-mail"
          value={this.state.email}
          onChangeText={this.handleEmailChange}
          autoCapitalize= "none"
          autoCorrect={false}
        />
        <Input 
          placeHolder="Senha"
          value={this.state.password}
          onChangeText={this.handlePasswordChange}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
        {this.state.error.length !== 0 && <ErrorMessage>{this.state.error}</ErrorMessage>}
        <Button onPress={this.handleSingInPress}>
          <ButtonText>Entrar</ButtonText>
        </Button>
        <SignUpLink onPress={this.andleCreateAccountPress}>
          <SignUpLinkText>Criar conta grátis</SignUpLinkText>
        </SignUpLink>
      </Container>
    );
  }
}