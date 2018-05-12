const assert_internal = require('reassert/internal');
const git_state = require('git-state');

module.exports = {
    hasDirtyOrUntrackedFiles,
    isRepository,
    gitIsAvailable,
};

function hasDirtyOrUntrackedFiles({cwd}) {
    const {promise, resolvePromise, rejectPromise} = genPromise();
    git_state.check(cwd, (err, result) => {
        if( err ) {
            rejectPromise(err);
            return;
        }
        const ret = result.dirty!==0 || result.untracked!==0;
        resolvePromise(ret);
    });
    return promise;
}

function isRepository({cwd}) {
    const {promise, resolvePromise} = genPromise();
    git_state.isGit(cwd, exists => {resolvePromise(exists)});
    return promise;
}

function genPromise() {
    let resolvePromise;
    let rejectPromise;
    const promise = new Promise((resolve, reject) => {resolvePromise=resolve;rejectPromise=reject});
    return {promise, resolvePromise, rejectPromise};
}

function gitIsAvailable() {
    const child_process = require('child_process');
    const {exec} = child_process;

    const {promise, resolvePromise} = genPromise();

    exec(
        'git --version',
        {},
        (err, stdout, stderr) => {
            resolvePromise(err===null);
        }
    );

    return promise;
}
