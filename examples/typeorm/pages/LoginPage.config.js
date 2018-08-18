import React from 'react';

const LoginForm = () => (
    <form action="auth/signin" method="get">
        <input name="username" id="username" defaultValue="u1"/>
        <input name="password" id="password" defaultValue="testpw"/>
        <button>Login</button>
    </form>
);

const LoginPage = {
    route: '/login',
    view: LoginForm,
};

export default LoginPage;
