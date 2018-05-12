import React from 'react';
import {Link, Route} from "react-router-dom";
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    box: { padding: 10 },
    text: { fontWeight: 'bold', color: 'green' },
});

const App = () => (
  <View style={styles.box}>
    <Text style={styles.text}>Hello from native web!</Text>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>
    <Route exact path="/" component={Home} />
    <Route path="/about" component={About} />
  </View>
);

const Home = () => (
  <Text style={styles.text}>Home</Text>
);

const About = () => (
  <Text style={styles.text}>About</Text>
);

const pageConfig = {
  route: '/:params*',
  view: App,
};

export default pageConfig;
