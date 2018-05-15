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
