import React from 'react';
import EasiClient from '../server/easi/EasiClient';

const Welcome = ({users}) => (
    <div>{
        users
        .map(user => <div>{user}</div>)
    }</div>
);

const WelcomePage = {
    route: '/',
    view: Welcome,

    getInitialProps: async () => {
        const users = await EasiClient.get({
            objectType: 'User',
        });
        console.log(users);
        return {users};
    },
};

export default WelcomePage;
