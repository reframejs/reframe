module.exports = runNpmInstall;

function runNpmInstall(cwd, {packages}={}) {
    const spawn = require('cross-spawn');
    const assert_internal = require('reassert/internal');

    assert_internal(cwd);

    const commandInput = [
        'install',

        '--loglevel',
        'error',

        // We let the user decide whether to use `yarn.lock` or `package-lock.json`
        '--no-package-lock',

        ...(packages ? ['--save', ...packages] : []),
    ];

    const child = spawn('npm', commandInput, {stdio: 'inherit', cwd});

    const {promise, resolvePromise, rejectPromise} = genPromise();
    child.on('close', exitCode => {
        if( exitCode === 0 ) {
            resolvePromise();
        } else {
            rejectPromise(exitCode);
        }
    });
    return promise;
}

function genPromise() {
    let resolvePromise;
    let rejectPromise;
    const promise = new Promise((resolve, reject) => {resolvePromise=resolve;rejectPromise=reject});
    return {promise, resolvePromise, rejectPromise};
}
