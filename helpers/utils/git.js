//const assert_internal = require('reassert/internal');
const simple_git = require('simple-git/promise');
const git_state = require('git-state');

module.exports = {
    hasDirtyOrUntrackedFiles,
    isRepository,
    commit,
    init,
};

async function init({cwd}) {
    await simple_git(cwd).init();
}

async function commit({cwd, message}) {
    const gitP = simple_git(cwd);
    await gitP.add('./*');
    await gitP.commit(message);
}

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
