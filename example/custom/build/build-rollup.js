const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const inputOptions = {
    input: 'pages/hello.html.mjs',
    plugins: [
        resolve(),
        commonjs(),
    ],
};

const outputOptions = {
    format: 'iife',
    name: 'MyBundle',
};

build();

async function build() {
    const bundle = await rollup.rollup(inputOptions);

    const output = await bundle.generate(outputOptions);
    console.log(output.code);
}
