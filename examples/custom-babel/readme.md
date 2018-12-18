<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/custom-babel/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/custom-babel/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/custom-babel/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/custom-babel/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/custom-babel/readme.template.md` instead.






-->

# Custom Babel Config Example

Example of an app that uses a custom babel config by defining a `.babelrc`:

~~~js
// /examples/custom-babel/.babelrc

{
    "plugins": [
        ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ]
}
~~~

~~~js
// /examples/custom-babel/pages/welcome.config.js

import React from 'react';

class Hey extends React.Component {
    render = () => {
        return (
            <h3>{
                this.boundFunction()
            }</h3>
        );
    }

    instanceProperty = "class properties.";
    boundFunction = () => {
        return Hey.staticFunction()+this.instanceProperty;
    }

    static staticProperty = "Hello from ";
    static staticFunction = function() {
        return Hey.staticProperty;
    }
}


const WelcomePage = {
    route: '/',
    view: Hey,
};

export default WelcomePage;
~~~

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/custom-babel/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/custom-babel/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/custom-babel/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/custom-babel/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/examples/custom-babel/readme.template.md` instead.






-->
