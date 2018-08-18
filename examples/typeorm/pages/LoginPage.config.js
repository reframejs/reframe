import React from 'react';

const LoginForm = () => (
    <form action="auth/signin" method="post">
        <input name="username" id="username" value="testusi"/>
        <input name="password" id="password" value="testpw"/>
        <button>Login</button>
    </form>
);

const LoginPage = {
    route: '/login',
    view: LoginForm,
};

export default LoginPage;
