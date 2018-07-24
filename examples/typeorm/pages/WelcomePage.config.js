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
            <form onSubmit={this.onSubmit.bind(this)}>
                <input type="text" name="firstName" onChange={this.onChange.bind(this)}/>
                <input type="text" name="lastName" onChange={this.onChange.bind(this)}/>
                <button type="submit">Add User</button>
            </form>
        );
    }
    onChange(ev) {
        const {name, value} = ev.target;
        this.setState({[name]: value});
    }
    async onSubmit(ev) {
        ev.preventDefault();
        const object = this.state;
        const response = await easyqlClient.query({
            queryType: 'write',
            modelName: 'User',
            object,
        });
        if( response.statusCode!==404 ) {
            window.document.location.reload();
        }
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
        const response = await easyqlClient.query({
            queryType: 'read',
            modelName: 'User',
        });

        const users = response.objects;

        return {users};
    },
};

export default WelcomePage;
