import rollup from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import globals from 'rollup-plugin-node-globals';
import babel from 'rollup-plugin-babel';

export default buildScript;

async function buildScript({browserDistPath, pages}) {
    const compileInfo = getCompileInfo({browserDistPath, pages});
    for(const {inputOptions, outputOptions} of compileInfo) {
        await compile({inputOptions, outputOptions});
    }
}

async function compile({inputOptions, outputOptions}) {
    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);
}

function getCompileInfo({browserDistPath, pages}) {
    const scripts = [];

    pages
    .forEach(pageObject => {
        (pageObject.scripts||[])
        .forEach(({diskPath, src, bundleName}) => {
            const inputOptions = {
                input: diskPath,
                plugins: [
/*
                    resolve(),
                    globals(),
*/
                    json(),
/*
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [ [ 'babel-preset-env', {modules: false} ] ],
   // presets: [ [ 'es2015', { modules: false } ], 'stage-0', 'react' ],
   // plugins: [ 'external-helpers' ]
    }),
*/
	cjs(),
/*
    cjs({
      exclude: 'node_modules/process-es6/**',
      include: [
        'node_modules/create-react-class/**',
        'node_modules/fbjs/**',
        'node_modules/object-assign/**',
        'node_modules/react/**',
        'node_modules/react-dom/**',
        'node_modules/prop-types/**'
      ]
    }),
*/
 // globals(),
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    resolve({
      browser: true,
      main: true
    })
                ],
            };
            const outputOptions = {
                format: 'iife',
                name: bundleName,
                file: browserDistPath+src,
            };
            scripts.push({
                inputOptions,
                outputOptions,
            });
        });
    });

    return scripts;
}
