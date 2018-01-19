import rollup from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default buildScript;

async function buildScript({browserDistPath}) {
    const {inputOptions, outputOptions} = getOptions({browserDistPath});

    const bundle = await rollup.rollup(inputOptions);

    await bundle.write(outputOptions);
    /*
    const output = await bundle.generate(outputOptions);
    console.log(output.code);
    */
}

function getOptions({browserDistPath}) {
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
        file: browserDistPath+'/bundle.js',
    };

    return {
        inputOptions,
        outputOptions,
    };
}
