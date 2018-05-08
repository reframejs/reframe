import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class App extends React.Component {
    render() {
        return (
            <View style={styles.box}>
                <Text style={styles.text}>Hello from native web!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    box: { padding: 10 },
    text: { fontWeight: 'bold', color: 'green' },
});

export default {
    route: '/',
    view: App,
};
