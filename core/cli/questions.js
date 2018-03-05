//const chalk = require('chalk');

//module.exports = questions;

const questions = [
    {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        validate: (value) => {
            return value ? true : "Please provide a project name.";
        }
    },
    {
        type: 'confirm',
        name: 'useRedux',
        message: 'Will you be using Redux for this project?',
        default: false
    },
    {
        type: 'checkbox',
        name: 'plugins',
        message: 'Which plugins would you like to include?',
        choices: [
            'Hello'
        ]
    }
]

module.exports = {questions};