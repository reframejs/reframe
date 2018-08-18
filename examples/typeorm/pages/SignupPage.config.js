import React from 'react';

const SignupForm = () => (
    <form action="auth/signup" method="post">
        <input name="username" id="username" value="testusi"/>
        <input name="password" id="password" value="testpw"/>
        <button>Singup</button>
    </form>
);

const SignupPage = {
    route: '/signup',
    view: SignupForm,
};

export default SignupPage;

