import rollup from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

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
                    resolve(),
                    commonjs(),
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
