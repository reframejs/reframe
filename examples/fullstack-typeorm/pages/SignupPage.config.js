import React from 'react';

const SignupForm = () => (
    <form action="auth/signup" method="post">
        <input type="text" name="username" defaultValue="u1"/>
        <input type="password" name="password" defaultValue="testpw"/>
        <button type="submit">Sign Up</button>
    </form>
);

const SignupPage = {
    route: '/signup',
    view: SignupForm,
};

export default SignupPage;

