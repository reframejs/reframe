module.exports = cliPlugins;

function cliPlugins() {
    return {
        name: require('./package.json').name,
        plugins: [
            testOne(),
            testTwo()
        ]
    };
}

function testOne() {
    return {
        name: 'hello',
        cliCommands: [
            {
                name: 'hello',
                description: 'testing hello plugin',
                action: () => {
                    console.log('hello');
                },
            },
        ],
    }
}

function testTwo() {
    return {
        name: 'goodbye',
        cliCommands: [
            {
                name: 'goodbye',
                description: 'testing goodbye plugin',
                action: () => {
                    console.log('goodbye');
                },
            },
        ],
    }
}