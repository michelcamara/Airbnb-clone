import React from 'react';

import Routes from './routes';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
MapboxGL.setAccessToken('pk.eyJ1IjoibWljaGVsY2FtYXJhIiwiYSI6ImNrNGExMjkzbDBiMngzcnJ5MW9weHFyZTkifQ.s0x4iBB14Tzc5T-IF97jew');

const App = () => <Routes />;

export default App;