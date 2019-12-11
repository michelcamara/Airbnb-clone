//apenas importa as telas das respectivas pastas e em seguida 
//as insere em uma Stack de navegação.
import { createStackNavigation } from 'react-navigation';

import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import Main from './pages/main';

const Routes = createStackNavigation({
  SignIn,
  SignUp,
  Main,
});

export default Routes;