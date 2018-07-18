import React from 'react';
import easyqlClient from '../server/easyql/client/easyqlClient';

const Welcome = ({users}) => (
    <div>{
        users
        .map(user => <div key={user.id}>{user.firstName+" "+user.lastName}</div>)
    }</div>
);

const WelcomePage = {
    route: '/',
    view: Welcome,

    getInitialProps: async () => {
        const users = await easyqlClient.get({
            objectType: 'User',
        });
        console.log(users);
        return {users};
    },
};

export default WelcomePage;
