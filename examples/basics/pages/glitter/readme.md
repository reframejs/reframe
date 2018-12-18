<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/glitter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/glitter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/glitter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/glitter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/glitter/readme.template.md` instead.






-->

This page exhibits code that uses CSS and static assets.

~~~js
// /examples/basics/pages/glitter/GlitterPage.config.js

const {GlitterComponent} = require('./GlitterComponent');

const GlitterPage = {
    route: '/glitter',
    title: 'Glamorous Page',
    view: GlitterComponent,
    doNotRenderInBrowser: true,
};

module.exports = GlitterPage;
~~~

~~~js
// /examples/basics/pages/glitter/GlitterComponent.js

import React from 'react';
import './GlitterStyle.css';
import diamondUrl from './diamond.png';

const Center = ({children, style}) => (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', ...style
      }}
    >
        {children}
    </div>
);

const Diamond = () => <div className="diamond diamond-background"/>;

const GlitterComponent = () => (
    <Center style={{fontSize: '2em'}}>
        <Diamond/>
        Shine
        <img className='diamond' src={diamondUrl}/>
    </Center>
);

export {GlitterComponent};
~~~

~~~css
// /examples/basics/pages/glitter/GlitterStyle.css

body {
    background-color: pink;
    font-family: 'Tangerine';
    font-size: 2em;
}
.diamond-background {
    background-image: url('./diamond.png');
    background-repeat: no-repeat;
    background-size: contain;
}

.diamond {
    width: 80px;
    height: 47px;
    margin: 25px;
    display: inline-block;
}

@font-face {
    font-family: 'Tangerine';
    src: url('./Tangerine.ttf') format('truetype');
}
~~~

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/glitter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/glitter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/glitter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/glitter/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/basics/pages/glitter/readme.template.md` instead.






-->
