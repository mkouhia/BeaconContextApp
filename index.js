/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import SQLiteDemo from './database.js';

//AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(appName, () => SQLiteDemo);
