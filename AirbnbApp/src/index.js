import React from 'react';

import Routes from './routes';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
MapboxGL.setAccessToken('seu-token-aqui');

const App = () => <Routes />;

export default App;