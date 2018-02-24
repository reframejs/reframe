module.exports = {homeViewTemplate, homePageTemplate};

function homeViewTemplate() {
    let template =

`import React, { Component } from 'react';

class HomeView extends Component {

    render() {
        return (
            <div>
                <h3>Hello from Reframe!</h3>
            </div>
        );
    }
}

export default HomeView;
`;

    return template;
}

function homePageTemplate(projectName) {
    let template =

`import React from 'react';
import HomeView from '../views/homeView';

const HomePage = {
    route: '/',
    view: HomeView,
    title: '${projectName}'
};

export default HomePage;
`;

    return template;
}