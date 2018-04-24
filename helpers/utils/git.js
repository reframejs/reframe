const assert_internal = require('reassert/internal');
const simple_git = require('simple-git/promise');
const git_state = require('git-state');

module.exports = {
    hasDirtyOrUntrackedFiles,
    isRepository,
    commit,
    init,
    gitIsInstalled,
    gitIsConfigured,
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

function gitIsInstalled() {
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

function gitIsConfigured({cwd}) {
    const child_process = require('child_process');
    const {exec} = child_process;

    const {promise, resolvePromise} = genPromise();

    exec(
        'git config -l',
        {},
        (err, stdout, stderr) => {
            if( err!==null ) {
                rejectPromise(err);
                return;
            }
            if( stderr ) {
                rejectPromise(stderr);
                return;
            }

            const lines = stdout.split('\n');

            const hasUserName = lines.some(line => line.startsWith('user.name'));
            const hasUserEmail = lines.some(line => line.startsWith('user.email'));

            resolvePromise(hasUserName && hasUserEmail);
        }
    );

    return promise;
}
