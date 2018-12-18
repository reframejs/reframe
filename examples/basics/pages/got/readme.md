<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/got/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/got/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/got/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/got/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/got/readme.template.md` instead.






-->

# Pages Loading Data

We define two pages that load data:
 - GameOfThronesPage - Loads data by adding `async getInitialProps()` to its page config.
 - GameOfThronesPage2 - Loads data by using a stateful component.




### GameOfThronesPage - Using `async getInitialProps()`

~~~js
// /examples/basics/pages/got/GameOfThronesPage.config.js

import React from 'react';
import getCharacters from './data/getCharacters';
import CharacterList from './views/CharacterList';

export default {
    route: '/game-of-thrones',

    // Everything returned in `getInitialProps()` is passed to the props of the view
    getInitialProps: async () => {
        const characters = await getCharacters();
        return {characters};
    },

    // Our data is available at `props.characters`
    view: props => <CharacterList characters={props.characters}/>,

    doNotRenderInBrowser: true,
};
~~~

Because `aysnc getInitialProps()` is called and waited for prior to rendering the HTML, our page's HTML `view-source:http://localhost:3000/game-of-thrones` displays the data already.

~~~html
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="root-react">
            <div>
                <h3>Game of Thrones Characters</h3>
                <table border="7" cellPadding="5"><tbody>
                    <tr><td>Daenerys Targaryen</td></tr>
                    <tr><td>Jon Snow</td></tr>
                    <tr><td>Cersei Lannister</td></tr>
                    <tr><td>Petyr Baelish</td></tr>
                    <tr><td>Bran Stark</td></tr>
                    <tr><td>Tyrion Lannister</td></tr>
                    <tr><td>Varys</td></tr>
                    <tr><td>Tormund</td></tr>
                    <tr><td>Samwell Tarly</td></tr>
                </tbody></table>
            </div>
        </div>
    </body>
</html>
~~~

Note that because the HTML already contains the data, we can set `doNotRenderInBrowser: true` for increased performance.




### GameOfThronesPage2 - Using stateful component

~~~js
// /examples/basics/pages/got/GameOfThronesPage2.config.js

import React from 'react';
import getCharacters from './data/getCharacters';
import CharacterList from './views/CharacterList';

class Characters extends React.Component {
    render() {
        if( ! this.state || this.state.characters===undefined ) {
            return <div>Loading...</div>;
        }
        return <CharacterList characters={this.state.characters}/>;
    }
    async componentDidMount() {
        const characters = await getCharacters();
        this.setState({characters});
    }
}

export default {
    route: '/game-of-thrones-2',
    view: Characters,
};
~~~

When using such stateful component,
the server renders the HTML before the data is loaded.
In our case,
 this means that the HTML `view-source:http://localhost:3000/game-of-thrones-2`
displays the loading state `<div id="root-react"><div>Loading...</div></div>`.
And the HTML returned by the server is:

~~~html
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="root-react"><div>Loading...</div></div>
        <script src="/commons.hash_451146e5dbcfe0b09f80.js" type="text/javascript"></script>
        <script src="/GameOfThronesPage2.entry.hash_2c79748d10c1e953f159.js" type="text/javascript"></script>
    </body>
</html>
~~~



<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/got/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/got/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/got/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/got/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/got/readme.template.md` instead.






-->
