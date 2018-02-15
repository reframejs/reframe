<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.






-->
[<p align="center"><img src="https://github.com/brillout/reframe/raw/master/docs/images/logo-with-title.svg?sanitize=true" width=450 height=94 style="max-width:100%;" alt="Reframe"/></p>](https://github.com/brillout/reframe)
<div><p align="center">
        Framework to create React web apps.
</p></div>
<div><p align="center">
    <b>Easy</b>
    -
    Create apps with page configs.
    &nbsp;&nbsp;&nbsp;
    <b>Universal</b>
    -
    Create all kinds of apps.
    &nbsp;&nbsp;&nbsp;
    <b>Customizable</b>
    -
    Everything is adaptable.
</p></div>
<div><p align="right">
    <img src="https://github.com/brillout/reframe/raw/master/docs/images/online-icon.svg?sanitize=true" width="16" height="25"> Chat with Reframe Author on <a href="https://discord.gg/kqXf65G">discord.gg/kqXf65G</a>
</p></div>

[Overview](/../../)<br/>
[Usage Manual](/docs/usage-manual.md)<br/>
[Customization Manual](/docs/customization-manual.md)

<br/>

The customization manual acts as reference for advanced Reframe customization. Basic customization are covered in the Usage Manual.

As your app grows, you will likely need to implement edge cases not covered by Reframe.
In these situations, we refer to this Customization Manual.
With willingness to dive into Reframe and to re-write parts, pretty much all edge cases should be achievable.

Reframe consists of three packages;
`@reframe/build` that transpiles and bundles code,
`@reframe/server` that creates a server serving dynamic HTMLs and static assets,
and `@reframe/browser` that hydrates React components in the browser.
Reframe is designed so that each package can be replaced with code of your own.

If you replace `@reframe/browser` with your own code, then you have full control over the browser JavaScript.
If you replace `@reframe/server` with your own code, then you have full control over the server.
If you replace `@reframe/build` with your own code, then you have full control over the build step.
And if you replace all three packages, then you effectively got rid of Reframe.

The customizing manual gives a good overview of how packages can be re-written but partially lacks detailed information.
Open a GitHub issue to get detailed info and support.

# Customization Manual

##### Contents

 - [Custom Server](#custom-server)
   - [Reframe as hapi plugin](#reframe-as-hapi-plugin)
   - [Full Customization](#full-customization)
 - [Custom Browser JavaScript](#custom-browser-javascript)
   - [Custom Browser Entry](#custom-browser-entry)
   - [External Scripts](#external-scripts)
   - [Common Script](#common-script)
   - [Full Customization](#full-customization-1)
 - [Custom Build](#custom-build)
   - [Webpack Config Modification](#webpack-config-modification)
   - [Full Custom Webpack Config](#full-custom-webpack-config)
   - [Full Build Customization](#full-build-customization)
 - [Custom Repage](#custom-repage)
 - [Get rid of Reframe](#get-rid-of-reframe)

## Custom Server

##### Contents

 - [Reframe as hapi plugin](#reframe-as-hapi-plugin)
 - [Full Customization](#full-customization)

### Reframe as hapi plugin

Instead of using Reframe as CLI, we can use it as hapi plugins.
For example:

~~~js
// /example/custom/server/hapi-server.js

const Hapi = require('hapi');
const {getReframeHapiPlugins} = require('@reframe/server');
const path = require('path');

(async () => {
    const server = Hapi.Server({port: 3000});

    const {HapiServerRendering, HapiServeBrowserAssets} = (
        await getReframeHapiPlugins({
            pagesDir: path.resolve(__dirname, '../../pages'),
        })
    );

    await server.register([
        {plugin: HapiServeBrowserAssets},
        {plugin: HapiServerRendering},
    ]);

    server.route({
        method: 'GET',
        path:'/custom-route',
        handler: function (request, h) {
            return 'This is a custom route. This could for example be an API endpoint.'
        }
    });

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
})();
~~~


### Full Customization

Instead of using `const {getReframeHapiPlugins} = require('@reframe/server');` we can also re-write the whole server from scratch.

This allows us, for example, to choose any server framework.
The following is a custom server implementation using Express instead of hapi.

~~~js
// /example/custom/server/express-server.js

const assert = require('reassert');
const assert_internal = assert;
const log = require('reassert/log');
const build = require('@reframe/build');

const Repage = require('@repage/core');
const {getPageHtml} = require('@repage/server');
const RepageRouterCrossroads = require('@repage/router-crossroads');
const RepageRenderer = require('@repage/renderer');
const RepageRendererReact = require('@repage/renderer-react');

const path = require('path');
const express = require('express');

startExpressServer();

async function startExpressServer() {
    const pagesDir = path.resolve(__dirname, '../../pages');
    let pages;
    const onBuild = args => {pages = args.pages};
    const {browserDistPath} = (
        await build({
            pagesDir,
            onBuild,
        })
    );

    const app = express();
    app.use(express.static(browserDistPath, {extensions: ['html']}));
    app.get('*', async function(req, res, next) {
        const {url} = req;
        const html = await renderPageToHtml(url, pages);

        if( ! html ) {
            next();
            return;
        }
        res.send(html);
    });
    app.listen(3000, function () {
        console.log('App listening on port 3000');
    });
}

async function renderPageToHtml(uri, pages) {
    const repage = createRepageObject(pages);

    const {html} = await getPageHtml(repage, uri, {canBeNull: true});

    return html;
}

function createRepageObject(pages) {
    const repage = new Repage();

    repage.addPlugins([
        RepageRouterCrossroads,
        RepageRenderer,
        RepageRendererReact,
    ]);

    repage.addPages(pages);

    return repage;
}
~~~

## Custom Browser JavaScript

##### Contents

 - [Custom Browser Entry](#custom-browser-entry)
 - [External Scripts](#external-scripts)
 - [Common Script](#common-script)
 - [Full Customization](#full-customization-1)

### Custom Browser Entry

When Reframe stumbles upon a `.universal.js` or `.dom.js` page config, it automatically generates a browser entry code that will load in the browser.

The following is an example of such generated browser entry code.

~~~js
var hydratePage = require('/usr/lib/node_modules/@reframe/cli/node_modules/@reframe/browser/hydratePage.js');
var pageConfig = require('/home/brillout/tmp/reframe-playground/pages/HelloPage.universal.js');

// hybrid cjs and ES6 module import
pageConfig = Object.keys(pageConfig).length===1 && pageConfig.default || pageConfig;

hydratePage(pageConfig);
~~~

We can, however, create the browser entry code ourselves.

Instead of providing a `.universal.js` or `.dom.js` page config,
we provide only one page config `.html.js` along with a `.entry.js` file.
Reframe will then use the `.entry.js` code as browser entry instead of generating one.

For example:

~~~js
// /example/pages/TrackingPage.html.js

import React from 'react';

import {TimeComponent} from '../views/TimeComponent';

export default {
    title: 'Tracking Example',
    route: '/tracker',
    view: () => <div>Hi, you are being tracked. The time is <TimeComponent/></div>,
    scripts: [
        {
            async: true,
            src: 'https://www.google-analytics.com/analytics.js',
        },
    ],
};
~~~

~~~js
// /example/pages/TrackingPage.entry.js

import hydratePage from '@reframe/browser/hydratePage';
import TrackingPage from './TrackingPage.html.js';

window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', 'UA-XXXXX-Y', 'auto');
ga('send', 'pageview');

(async () => {
    const before = new Date();
    // we are reusing the .html.js page definition `TrackingPage` but
    // we could also use another page definition
    await hydratePage(TrackingPage);
    const after = new Date();
    ga('send', 'event', {eventAction: 'page hydration time', eventValue: after - before});
})();
~~~

### External Scripts

The page's `<head>` is fully customaziable,
and we can load external scripts such as `<script async src='https://www.google-analytics.com/analytics.js'></script>`,
load a `<script>` as ES6 module,
add a `async` attribute to a `<script>`,
etc.

See the "Custom Head" section of the Usage Manual for more information.

### Common Script

Multiple pages can share common browser code by using the `diskPath` property in the page config, as shown in the following example:

~~~js
// /example/custom/browser/pages/terms.html.js

import React from 'react';
import PageCommon from './PageCommon';

export default {
    route: '/terms',
    view: () => (
        <div>
            <h1>Terms of Service</h1>
            <div>
                The long beginning of some ToS...
            </div>
        </div>
    ),
    ...PageCommon,
};
~~~
~~~js
// /example/custom/browser/pages/privacy.html.js

import React from 'react';
import PageCommon from './PageCommon';

export default {
    route: '/privacy',
    view: () => (
        <div>
            <h1>Privacy Policy</h1>
            <div>
                Some text about privacy policy...
            </div>
        </div>
    ),
    ...PageCommon,
};
~~~
~~~js
// /example/custom/browser/pages/PageCommon.js

const PageCommon = {
    title: 'My Web App',
    description: 'This Web App helps you with ...',
    htmlIsStatic: true,
    scripts: [
        {
            async: true,
            src: 'https://www.google-analytics.com/analytics.js',
        },
        {
            diskPath: './PageCommon.entry.js',
        },
    ],
};

export default PageCommon;
~~~
~~~js
// /example/custom/browser/pages/PageCommon.entry.js

window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', 'UA-XXXXX-Y', 'auto');
ga('send', 'pageview');
console.log('pageview tracking sent');
~~~

### Full Customization

We saw in the section "Custom Browser Entry" how to write the browser entry code ourself.

For example:

~~~js
import hydratePage from '@reframe/browser/hydratePage';
import MyPage from 'path/to/MyPage-page-config.js';

hydratePage(MyPage);
~~~

But we can go further by not using `@reframe/browser/hydratePage` and re-writing that part ouserlves.

Let's look at the code of `@reframe/browser/hydratePage`

~~~js
// /browser/hydratePage.js

const {processReframeBrowserConfig} = require('@reframe/utils/processReframeBrowserConfig');

const Repage = require('@repage/core');
const {hydratePage: repage_hydratePage} = require('@repage/browser');

module.exports = hydratePage;

async function hydratePage(page, reframeBrowserConfig={}) {
    processReframeBrowserConfig(reframeBrowserConfig);

    const repage = new Repage();

    repage.addPlugins([
        ...reframeBrowserConfig._processed.repage_plugins,
    ]);

    return await repage_hydratePage(repage, page);
}
~~~

As we can see, the code simply initializes a Repage instance and calls `@repage/browser`'s `hydratePage()` function.

Instead of using Repage we can manually hydrate the page ourselves.
The following is an example of doing so.
At this point, our browser JavaScript doesn't depend on Reframe nor on Repage.
It is fully under our control.

~~~js
// /example/custom/browser/pages/custom-browser.html.js

import React from 'react';
import {TimeComponent} from '../../../views/TimeComponent';

export default {
    route: '/custom-hydration',
    view: () => (
        <div>
            <div>
                Some static stuff.
            </div>
            <div>
                Current Time:
                <span id="time-hook">
                    <TimeComponent/>
                </span>
            </div>
        </div>
    ),
    htmlIsStatic: true,
};
~~~
~~~js
// /example/custom/browser/pages/custom-browser.entry.js

import React from 'react';
import ReactDOM from 'react-dom';

import {TimeComponent} from '../../../views/TimeComponent';

ReactDOM.hydrate(<TimeComponent/>, document.getElementById('time-hook'));
~~~

## Custom Build

##### Contents

 - [Webpack Config Modification](#webpack-config-modification)
 - [Full Custom Webpack Config](#full-custom-webpack-config)
 - [Full Build Customization](#full-build-customization)

### Webpack Config Modification

The webpack configuration generated by Reframe can be modified by providing
the arguments `getWebpackServerConfig` and `getWebpackBrowserConfig`
to `getReframeHapiPlugins()`.

~~~js
await getReframeHapiPlugins({
    pagesDir,
    getWebpackBrowserConfig,
    getWebpackServerConfig,
});
~~~

The following example uses `getWebpackBrowserConfig()` to add the PostCSS loader to the configuration.

~~~js
// /example/custom/build/webpack-config-mod/config-mod.js

module.exports = {getWebpackBrowserConfig, getWebpackServerConfig};

function getWebpackBrowserConfig({config}) {
    const cssRule = {
        test: /\.css$/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    plugins: [
                        require('postcss-cssnext')(),
                    ],
                    parser: 'sugarss'
                }
            }
        ]
    };

    const cssRuleIndex = (
        config.module.rules
        .findIndex(({test: testRegExp}) => testRegExp.test('dummy-name.css'))
    );

    config.module.rules[cssRuleIndex] = cssRule;

    return config;
}

function getWebpackServerConfig({config}) {
    // We don't modify the server config as the server doesn't load any CSS
    return config;
}
~~~
~~~js
// /example/custom/build/webpack-config-mod/server.js

const Hapi = require('hapi');
const {getReframeHapiPlugins} = require('@reframe/server');
const {getWebpackBrowserConfig, getWebpackServerConfig} = require('./config-mod');
const path = require('path');

startServer();

async function startServer() {
    const server = Hapi.Server({port: 3000});

    const pagesDir = path.resolve(__dirname, './pages');

    const {HapiServerRendering, HapiServeBrowserAssets} = (
        await getReframeHapiPlugins({
            pagesDir,
            getWebpackBrowserConfig,
            getWebpackServerConfig,
        })
    );

    await server.register([
        {plugin: HapiServeBrowserAssets},
        {plugin: HapiServerRendering},
    ]);

    await server.start();

    console.log(`Server running at ${server.info.uri}`);
}
~~~

### Full Custom Webpack Config

The arguments
`getWebpackServerConfig` and `getWebpackBrowserConfig`
of `getReframeHapiPlugins()`,
mentioned in the previous section,
also allows us to use an entire custom webpack configuration.

The only restriction for a fully custom config is that the browser entry file and the corresponding server entry file have the same base name.
Reframe can't otherwise know which browser entry is meant for which page config.
For example, a browser entry saved at `/path/to/MyPage.entry.js` would match a page config saved at `/path/to/MyPage.html.js`, because they share the same base name `MyPage`.

The following is a `getWebpackBrowserConfig()` usage example for a entirely custom config.

~~~js
// /example/custom/build/custom-webpack-config/webpack-config.js

const rules = [
    {
        test: /.js$/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    'babel-preset-react',
                    'babel-preset-env',
                ].map(require.resolve),
            }
        },
        exclude: [/node_modules/],
    }
];

const getWebpackBrowserConfig = () => ({
    entry: [
        'babel-polyfill',
        '../../../pages/CounterPage.entry.js',
    ],
    output: {
        publicPath: '/',
        path: __dirname+'/dist/browser',
    },
    module: {rules},
});

const getWebpackServerConfig = () => ({
    entry: '../../../pages/CounterPage.html.js',
    target: 'node',
    output: {
        publicPath: '/',
        path: __dirname+'/dist/server',
        libraryTarget: 'commonjs2'
    },
    module: {rules},
});

module.exports = {getWebpackBrowserConfig, getWebpackServerConfig};
~~~
~~~js
// /example/custom/build/custom-webpack-config/server.js

const Hapi = require('hapi');
const {getReframeHapiPlugins} = require('@reframe/server');
const {getWebpackBrowserConfig, getWebpackServerConfig} = require('./webpack-config');

startServer();

async function startServer() {
    const server = Hapi.Server({port: 3000});

    const {HapiServerRendering, HapiServeBrowserAssets} = (
        await getReframeHapiPlugins({
            getWebpackBrowserConfig,
            getWebpackServerConfig,
            log: true,
        })
    );

    await server.register([
        {plugin: HapiServeBrowserAssets},
        {plugin: HapiServerRendering},
    ]);

    await server.start();

    console.log(`Server running at ${server.info.uri}`);
}
~~~

### Full Build Customization

By default, Reframe uses webpack.
But we can implement a fully custom build step, which means that we can use a build tool other than webpack.

The following is an example of a custom build step using [Rollup](https://github.com/rollup/rollup) and [Node.js's support for ES modules over the --experimental-modules flag](https://nodejs.org/api/esm.html).

~~~js
// /example/custom/build/custom-bundler/server.mjs

import Hapi from 'hapi';
import buildAll from './build-all.mjs';
import ReframeServer from '@reframe/server';

process.on('unhandledRejection', err => {throw err});

startServer();

async function build({onBuild}) {
    const {pages, browserDistPath} = await buildAll();
    onBuild({pages, browserDistPath});
}

function getHapiPlugins() {
    return (
        ReframeServer.getReframeHapiPlugins({
            build,
        })
    );
}

async function startServer() {
    const server = Hapi.Server({port: 3000});

    const {HapiServerRendering, HapiServeBrowserAssets} = await getHapiPlugins();
    await server.register([
        {plugin: HapiServeBrowserAssets},
        {plugin: HapiServerRendering},
    ]);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
}
~~~
~~~js
// /example/custom/build/custom-bundler/build-all.mjs

import buildScript from './build-script.mjs';
import buildHtml from './build-html.mjs';
import expose from './expose.js';
import getPages from './get-pages.mjs';

export default buildAll;

async function buildAll() {
    const browserDistPath = getBrowserDistPath();

    const pages = getPages();

    await buildScript({browserDistPath, pages});
    await buildHtml({browserDistPath, pages});

    return {
        browserDistPath,
        pages,
    };
}

function getBrowserDistPath() {
    const {__dirname} = expose;
    const browserDistPath = __dirname+'/dist';
    return browserDistPath;
}
~~~
~~~js
// /example/custom/build/custom-bundler/build-script.mjs

import rollup from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';

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
    .forEach(pageConfig => {
        (pageConfig.scripts||[])
        .forEach(({diskPath, src, bundleName}) => {
            const inputOptions = {
                input: diskPath,
                plugins: [
                    json(),
                    cjs(),
                    replace({ 'process.env.NODE_ENV': JSON.stringify('') }),
                    resolve({
                      browser: true,
                    }),
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
~~~
~~~js
// /example/custom/build/custom-bundler/build-html.mjs

import Repage from '@repage/core';
import RepageBuild from '@repage/build';
import RepageRouterCrossroads from '@repage/router-crossroads';
import RepageRenderer from '@repage/renderer';
import RepageRendererReact from '@repage/renderer-react';

import getPages from './get-pages.mjs';

import fs from 'docs';
import path from 'path';
import mkdirp from 'mkdirp';

export default buildHtml;

async function buildHtml({browserDistPath}) {
    const staticPages = await getStaticPages();
    writeHtml({staticPages, browserDistPath});
}

function writeHtml({staticPages, browserDistPath}) {
    staticPages
    .map(({html, url: {pathname}}) => {
        const diskPath = (
            [
                browserDistPath,
                (pathname==='/' ? '/index' : pathname),
                '.html',
            ].join('')
        );
        return {html, diskPath};
    })
    .forEach(({html, diskPath}) => {
        writeFile(diskPath, html);
    });
}

function writeFile(diskPath, content) {
    mkdirp.sync(path.dirname(diskPath));
    fs.writeFileSync(diskPath, content);
}

function getStaticPages() {
    const pages = getPages();
    const repage = getRepageObject(pages);
    return RepageBuild.getStaticPages(repage);
}

function getRepageObject(pages) {
    const repage = new Repage();

    repage.addPlugins([
        RepageRouterCrossroads,
        RepageRenderer,
        RepageRendererReact,
    ]);

    repage.addPages(pages);

    return repage;
}
~~~
~~~js
// /example/custom/build/custom-bundler/get-pages.mjs

import HelloPage from './pages/hello.html.mjs';
import LandingPage from './pages/landing.html.mjs';
import expose from './expose.js';

export default getPages;

function getPages() {
    const {__dirname} = expose;

    const pages = (
        [
            {pageConfig: LandingPage, pageName: 'landing'},
            {pageConfig: HelloPage, pageName: 'hello'},
        ]
        .map(({pageConfig, pageName}) => {
            const scripts = pageConfig.scripts || [];
            scripts.push({
                diskPath: __dirname+'/pages/'+pageName+'.entry.js',
                src: '/'+pageName+'-bundle.js',
                bundleName: pageName+'Bundle',
                _options: {skipAttributes: ['diskPath', 'bundleName']},
            });
            return {...pageConfig, scripts};
        })
    );

    return pages;
}
~~~

## Custom Repage

Reframe is built on top of [Repage](https://github.com/brillout/repage),
a low-level plugin-based page management library,
and you can use Reframe with a custom Repage instance.

To do so,
and as shown in the example bellow,
we export a `getRepageInstance` function
that returns the Repage instance we want to use
in a `reframe.config.js` file.

The `reframe.config.js` file can be located at any ancestor directory of the `pages/` directory.

~~~js
const Repage = require('@repage/core');
const RepageRouterCrossroads = require('@repage/router-crossroads');
const RepageRenderer = require('@repage/renderer');
const RepageRendererReact = require('@repage/renderer-react');

module.exports = {getRepageInstance};

function getRepageInstance() {
    const repage = new Repage();

    repage.addPlugins([
        RepageRouterCrossroads,
        RepageRenderer,
        RepageRendererReact,
    ]);

    return repage;
}
~~~

## Get rid of Reframe

As show in this document, every part of Reframe can be re-written to depend on `@repage` packages only.
In turn, [Repage](https://github.com/brillout/repage) can progressively be overwritten over time as well.
This means that we can eventually and over time get rid of the entire Reframe and the entire Repage code.

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.






-->
