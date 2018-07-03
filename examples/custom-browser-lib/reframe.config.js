module.exports = {
    $plugins: [
        require('@reframe/react-kit')
    ]
};

module.exports['browserInitFile'] = require.resolve('./browser/browserInit.js');
