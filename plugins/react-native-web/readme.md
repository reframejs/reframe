<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-native-web/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-native-web/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-native-web/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-native-web/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-native-web/readme.template.md` instead.






-->

Reframe + React Native Web = :heart:

# `@reframe/react-native-web`

Implement views for the web and for native mobile using [React Native Web](https://github.com/necolas/react-native-web).

### Usage

Add `@reframe/react-native-web` to your `reframe.config.js`:

~~~js
module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/react-native-web') // npm install @reframe/react-native-web
    ]
};
~~~

### Example

~~~js
// /plugins/react-native-web/example/reframe.config.js

module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/react-native-web') // npm install @reframe/react-native-web
    ]
};
~~~

~~~js
// /plugins/react-native-web/example/pages/hello-native-web.config.js

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
~~~

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-native-web/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-native-web/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-native-web/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-native-web/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-native-web/readme.template.md` instead.






-->
