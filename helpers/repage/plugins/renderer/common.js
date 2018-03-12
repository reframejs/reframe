
const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;

module.exports = {
    run,
    prepare,
};

async function run(fcts, args, sequentially) {
    if( ! fcts ) {
        return;
    }
    assert_internal(fcts.constructor===Array, fcts);

    if( ! sequentially ) {
        return (
            Promise.all(fcts.map(fn => fn(args)))
        );
    }

    for(const fn of fcts) {
        await fn(args);
    }
}

async function prepare(args, {persist_output_in_memory_cache=false}={}) {
    let {page} = args;

    /*
    const load_page_data_output = await load_page_data({page, persist_output_in_memory_cache});
    page = Object.assign({}, page, load_page_data_output);
    */

    const init_output = await call_init({page, persist_output_in_memory_cache});

    args = Object.assign({}, init_output, args, {page});

    return args;
}

async function call_init({page, persist_output_in_memory_cache}) {
    assert_internal(page);
    assert_internal([true, false].includes(persist_output_in_memory_cache));

    if( ! page.init ) {
        return {};
    }
    assert_internal(page.init.originalFunctions);
    assert_internal(page.init.originalFunctions.length === 1);
    const orgFn = page.init.originalFunctions[0];

    const memory_cache_key = '__INTERNAL_DO_NOT_USE__output';

    //*
    if( persist_output_in_memory_cache && orgFn[memory_cache_key] ) {
        return orgFn[memory_cache_key];
    }
    //*/

    const init_output = await page.init();
    assert_usage(
        init_output && init_output.constructor===Object,
        "Page:",
        page,
        "Page `init`:",
        page.init,
        "Page `init` return value:",
        init_output,
        "Page `init` return value constructor:",
        init_output.constructor,
        "The above printed page `init` function should return a plain JavaScript object but returns the value printed above instead."
    );
    orgFn[memory_cache_key] = init_output;
    return init_output;
}

/*
async function load_page_data({page, persist_output_in_memory_cache}) {
    if( ! page.pageInfoLoader ) {
        return {};
    }

    const load_page_data_output = await page.pageInfoLoader();

    return load_page_data_output;
}
*/
