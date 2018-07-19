import React from 'react';
import easyqlClient from '../server/easyql/client/easyqlClient';

const UserList = ({users}) => (
    <div>{
        users
        .map(user =>
            <div key={user.id}>{user.firstName+" "+user.lastName}</div>
        )
    }</div>
);

class UserAdder extends React.Component {
    render() {
        return (
            <form onSubmit={this.onSubmit()}>
                <input type="text" name="firstName" onChange={this.onChange()}/>
                <input type="text" name="lastName" onChange={this.onChange()}/>
                <button type="submit"/>
            </form>
        );
    }
    onChange() {
        console.log(arguments);
    }
    onSubmit() {
    }
}

const Welcome = ({users}) => (
    <div>
        <UserList users={users}/>
        <UserAdder/>
    </div>
);

const WelcomePage = {
    route: '/',
    view: Welcome,

    getInitialProps: async () => {
        const users = await easyqlClient.query({
            queryType: 'read',
            modelName: 'User',
        });
        console.log(users);
        return {users};
    },
};

export default WelcomePage;
