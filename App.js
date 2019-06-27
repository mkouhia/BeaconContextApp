/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,
  Alert,
  Button
} from 'react-native';

import DatabaseHelper from './DatabaseHelper.js';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const SD = new DatabaseHelper();

type Props = {};
export default class App extends Component<Props> {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>

        <View style = {styles.column} >
            <View style={styles.row}>
                <Button title = "Enter" style={styles.btn} />
                <Button title = "Exit"  style={styles.btn} />
            </View>
            <Button style={styles.btn}
              onPress={() => {
                SD.runDemo();
                Alert.alert('You just ran the demo!');
              }}
              title="Run demo"
            />
            <Button style={styles.btn}
              onPress={() => {
                SD.closeDatabase();
                Alert.alert('Database closed!');
              }}
              title="Close database"
            />
            <Button style={styles.btn}
              onPress={() => {
                SD.deleteDatabase();
                Alert.alert('Database deleted!');
              }}
              title="Delete database"
            />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
});
