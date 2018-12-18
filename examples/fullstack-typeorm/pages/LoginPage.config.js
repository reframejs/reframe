import React from 'react';

const LoginForm = () => (
    <form action="auth/signin" method="post">
        <input type="text" name="username" defaultValue="u1"/>
        <input type="password" name="password" defaultValue="testpw"/>
        <button type="submit">Login</button>
    </form>
);

const LoginPage = {
    route: '/login',
    view: LoginForm,
};

export default LoginPage;
