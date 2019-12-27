import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StatusBar } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

import api from '../../services/api';

import {
  Container,
  Logo,
  Input,
  ErrorMessage,
  Button,
  ButtonText,
  SignUpLink,
  SignUpLinkText,
} from './styles';

export default class SignIn extends Component {
  //Ocultar o Header que vem por padrão nas telas da Stack do React Navigation
  static navigationOptions = {
    header: null,
  };
  //validação das props
  //é necessário a passagem de um objeto navigation que contenha as funções navigate e dispatch.
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      dispatch: PropTypes.func,
    }).isRequired,
  };

  state = {
    email: 'cso.junior1996@gmail.com',
    password: '123456',
    error: '',
  };

  //ela apenas irá recuperar um parâmetro e guardá-lo na variável email do state
  handleEmailChange = (email) => {
    this.setState({ email });
  };
  //é igual à primeira
  handlePasswordChange = (password) => {
    this.setState({ password });
  };
  //irá navegar para a tela de cadastro, ela irá usar o método navigate que está
  //disponível nas props do componente graças ao React Navigation
  handleCreateAccountPress = () => {
    this.props.navigation.navigate('SignUp');
  };
  //a responsável pela comunicação com a API e dar um resultado de sucesso ou erro para o Login
  handleSignInPress = async () => {
    //uma verificação para que o usuário não consiga enviar uma requisição para a API sem preencher os 2 campos, 
    //caso algum deles não esteja preenchido é setado uma mensagem de erro.
    if (this.state.email.length === 0 || this.state.password.length === 0) {
      this.setState({ error: 'Preencha usuário e senha para continuar!' }, () => false);
    }//Caso os campos tenham sido preenchidos irá entrar no bloco do else 
    else {
      //ler as etapas do TRY no documento Anotacoes.txt
      try {
        const response = await api.post('/sessions', {
          email: this.state.email,
          password: this.state.password,
        });

        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Main', params: { token: response.data.token } }),
          ],
        });
        this.props.navigation.dispatch(resetAction);
      } //o que é feito caso haja um erro é setar uma mensagem de erro no state também
      catch (_err) {
        this.setState({ error: 'Houve um problema com o login, verifique suas credenciais!' });
      }
    }
  };

  render() {
    return (
      <Container>
        <StatusBar hidden />
        <Logo source={require('../../images/airbnb_logo.png')} resizeMode="contain" />
        <Input
          placeholder="Endereço de e-mail"
          value={this.state.email}
          onChangeText={this.handleEmailChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          placeholder="Senha"
          value={this.state.password}
          onChangeText={this.handlePasswordChange}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
        {this.state.error.length !== 0 && <ErrorMessage>{this.state.error}</ErrorMessage>}
        <Button onPress={this.handleSignInPress}>
          <ButtonText>Entrar</ButtonText>
        </Button>
        <SignUpLink onPress={this.handleCreateAccountPress}>
          <SignUpLinkText>Criar conta grátis</SignUpLinkText>
        </SignUpLink>
      </Container>
    );
  }
}