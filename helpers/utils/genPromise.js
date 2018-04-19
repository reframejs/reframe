module.exports = gen_promise;

function gen_promise() {
    let promise_resolver;
    const promise = new Promise(resolve => promise_resolver=resolve);
    return {promise, resolvePromise: promise_resolver};
}
