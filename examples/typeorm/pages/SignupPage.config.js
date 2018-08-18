import React from 'react';

const SignupForm = () => (
    <form action="auth/signup" method="get">
        <input name="username" id="username" defaultValue="u1"/>
        <input name="password" id="password" defaultValue="testpw"/>
        <button>Singup</button>
    </form>
);

const SignupPage = {
    route: '/signup',
    view: SignupForm,
};

export default SignupPage;

