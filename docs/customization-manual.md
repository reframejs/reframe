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
<div><p align="right"><sup>
    <a href="#">
        <img
          src="https://github.com/reframejs/reframe/raw/master/docs/images/star.svg?sanitize=true"
          width="16"
          height="12"
        >
    </a>
    Star if you like
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://twitter.com/reframejs">
        <img
          src="https://github.com/reframejs/reframe/raw/master/docs/images/twitter-logo.svg?sanitize=true"
          width="15"
          height="13"
        >
        Follow on Twitter
    </a>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://discord.gg/kqXf65G">
        <img
          src="https://github.com/reframejs/reframe/raw/master/docs/images/online-icon.svg?sanitize=true"
          width="14"
          height="10"
        >
        Chat on Discord
    </a>
</sup></p></div>

[<p align="center"><img src="https://github.com/reframejs/reframe/raw/master/docs/images/logo-with-title.svg?sanitize=true" width=450 height=94 style="max-width:100%;" alt="Reframe"/></p>](https://github.com/reframejs/reframe)

<div><p align="center">
        Framework to create web apps with React.
</p></div>

<div><p align="center">
    <b>Easy</b>
    -
    Create apps with page configs.
    &nbsp;&nbsp;&nbsp;
    <b>Universal</b>
    -
    Create any type of app.
    &nbsp;&nbsp;&nbsp;
    <b>Escapable</b>
    -
    Easy & progressive escape.
</p></div>

<br/>

[Overview](/../../)<br/>
[Reframe Rationale](/docs/reframe-rationale.md)<br/>
[Usage Manual](/docs/usage-manual.md)<br/>
[**Customization Manual**](/docs/customization-manual.md)<br/>
[Plugins](/docs/plugins.md)

<br/>

# Customization Manual

The customization manual acts as reference for advanced Reframe customization. Basic customizations are covered in the Usage Manual.

As your app grows, you will likely need to implement edge cases not covered by Reframe.
In these situations, we refer to this Customization Manual.
With willingness to dive into Reframe and to re-write parts, pretty much all edge cases should be achievable.

Reframe consists of three packages;
`@reframe/build` that transpiles and bundles code,
`@reframe/server` that creates a server that serves dynamic HTMLs and static assets,
and `@reframe/browser` that hydrates React components in the browser.
Reframe is designed so that each of these three packages can be replaced with code of your own.

If you replace `@reframe/browser` with code of your own, then you have full control over the browser-side.
If you replace `@reframe/server` with code of your own, then you have full control over the server.
If you replace `@reframe/build` with code of your own, then you have full control over the build step.
And, if you replace all three packages, you effectively get rid of Reframe.

The customizing manual gives an overview of how packages can be re-written but partially lacks detailed information.
Open a GitHub issue to get detailed info and support.

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

Instead of using Reframe with its CLI, we can use Reframe as hapi plugins.
For example:

~~~js
// /examples/custom/server/hapi-server.js

const Hapi = require('hapi');
const getProjectConfig = require('@reframe/utils/getProjectConfig');
const HapiPluginServerRendering = require('@reframe/server/HapiPluginServerRendering');
const HapiPluginStaticAssets = require('@reframe/server/HapiPluginStaticAssets');
const path = require('path');

(async () => {
    const projectConfig = getProjectConfig();
    await projectConfig.build();

    const server = Hapi.Server({port: 3000});

    await server.register([
        HapiPluginStaticAssets,
        HapiPluginServerRendering,
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

Instead of using `const getHapiPlugins = require('@reframe/server/getHapiPlugins');` we can also re-write the whole server from scratch.

This allows us, for example, to choose any server framework.
The following is a custom server implementation using Express instead of hapi.

~~~js
// /examples/custom/server/express-server.js

const assert = require('reassert');
const assert_internal = assert;
const log = require('reassert/log');
const build = require('@reframe/build');
const getProjectConfig = require('@reframe/utils/getProjectConfig');

const Repage = require('@repage/core');
const {getPageHtml} = require('@repage/server');
const RepageRouterPathToRegexp = require('@repage/router-path-to-regexp');
const RepageRenderer = require('@repage/renderer');
const RepageRendererReact = require('@repage/renderer-react');

const path = require('path');
const express = require('express');

startExpressServer();

async function startExpressServer() {
    projectConfig.projectFiles.pagesDir = path.resolve(__dirname, '../../basics/pages');

    let pages;
    const onBuild = args => {pages = args.pages};
    const {browserDistPath} = (
        await build({
            pagesDirPath,
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
        RepageRouterPathToRegexp,
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

By default Reframe automatically generates a browser entry code such as the following:

~~~js
var hydratePage = require('/usr/lib/node_modules/@reframe/cli/node_modules/@reframe/browser/hydratePage.js');
var pageConfig = require('/home/brillout/tmp/reframe-playground/pages/HelloPage.js');

// hybrid cjs and ES6 module import
pageConfig = Object.keys(pageConfig).length===1 && pageConfig.default || pageConfig;

hydratePage(pageConfig);
~~~

We can, however, create the browser entry code ourselves.

We do that by providing a `pages/MyPage.entry.js` file along the page config `pages/MyPage.js`.
Reframe will then use `MyPage.entry.js` code as browser entry instead of generating one.
Reframe matches `MyPage.entry.js` with `MyPage.js` because the two filenames share the same prefix `MyPage`.

For example:

~~~js
// /examples/basics/pages/TrackingPage.js

import React from 'react';

import TimeComponent from '../views/TimeComponent';

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
    domStatic: true,
};
~~~

~~~js
// /examples/basics/pages/TrackingPage.entry.js

import hydratePage from '@reframe/browser/hydratePage';
import TrackingPage from './TrackingPage.js';

window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', 'UA-XXXXX-Y', 'auto');
ga('send', 'pageview');

(async () => {
    const before = new Date();
    // We are reusing the `TrackingPage` page config but
    // we could also use another page definition.
    await hydratePage(TrackingPage, __BROWSER_CONFIG);
    const after = new Date();
    ga('send', 'event', {eventAction: 'page hydration time', eventValue: after - before});
})();
~~~

### External Scripts

The page's `<head>` is fully customaziable,
and we can load external scripts (such as `<script async src='https://www.google-analytics.com/analytics.js'></script>`),
load a ES6 module with `<script type="module">`,
add a `async` attribute to a `<script>`,
etc.

See the "Custom Head" section of the Usage Manual for more information.

### Common Script

Multiple pages can share common browser code by using the `diskPath` property in the page config, as shown in the following example:

~~~js
// /examples/custom/browser/pages/terms.js

import React from 'react';
import PageCommon from './PageCommon.mixin';
import TimeComponent from '../../../basics/views/TimeComponent';

export default {
    route: '/terms',
    view: () => (
        <div>
            <h1>Terms of Service</h1>
            <div>
                The long beginning of some ToS...
            </div>
            <br/>
            Current Time: <TimeComponent/>
        </div>
    ),
    ...PageCommon,
};
~~~
~~~js
// /examples/custom/browser/pages/privacy.js

import React from 'react';
import PageCommon from './PageCommon.mixin';
import TimeComponent from '../../../basics/views/TimeComponent';

export default {
    route: '/privacy',
    view: () => (
        <div>
            <h1>Privacy Policy</h1>
            <div>
                Some text about privacy policy...
            </div>
            <br/>
            Current Time: <TimeComponent/>
        </div>
    ),
    ...PageCommon,
};
~~~
~~~js
// /examples/custom/browser/pages/PageCommon.mixin.js

const PageCommon = {
    title: 'My Web App',
    description: 'This Web App helps you with everything',
    browserEntry: './PageCommon.entry.js',
    scripts: [
        {
            async: true,
            src: 'https://www.google-analytics.com/analytics.js',
        },
    ],
};

export default PageCommon;
~~~
~~~js
// /examples/custom/browser/pages/PageCommon.entry.js

import hydratePage from '@reframe/browser/hydratePage';

(async () => {
    await hydratePage(__REFRAME__PAGE_CONFIG, __REFRAME__BROWSER_CONFIG);

    // We send the tracking only after the hydration is done
    window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
    ga('create', 'UA-XXXXX-Y', 'auto');
    ga('send', 'pageview');
    console.log('pageview tracking sent');
})();
~~~

### Full Customization

In the section "Custom Browser Entry" we saw how to write the browser entry code ourself.

For example:

~~~js
import hydratePage from '@reframe/browser/hydratePage';
import MyPage from 'path/to/MyPage-page-config.js';

hydratePage(MyPage);
~~~

But we can go further by not using `@reframe/browser/hydratePage` and re-writing that part ouserlves.

Let's look at the code of `@reframe/browser/hydratePage`

~~~js
// /helpers/repage/core/browser/hydratePage.js

const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;
const parseUri = require('@atto/parse-uri');

module.exports = hydratePage;

function hydratePage(repage, page_object) {
    assert_usage(
        repage && repage.isRepageObject && page_object,
        "Wrong arguments"
    );

    const navigation_handler = get_navigation_handler(repage);
    const uri = navigation_handler.getCurrentRoute();
    const url = parseUri(uri);
    const page = repage.getPageHandler(page_object);
    assert_usage(
        page.renderToDom,
        page
    );
    page.renderToDom({page, url});
}

function get_navigation_handler(repage) {
    assert_repage(repage);

    const navigation_handler = {};

    repage.plugins.forEach(plugin => {
        if( plugin.navigationHandler ) {
            Object.assign(navigation_handler, plugin.navigationHandler);
        }
    });

    return navigation_handler;
}

function assert_repage(repage) {
    repage.plugins.forEach(plugin => {
        assert_usage(
            plugin.isAllowedInBrowser===true,
            plugin,
            'Trying to add a plugin that is not allowed in the browser.',
            'I.e. the above printed object specifying the plugin is not having its property `isAllowedInBrowser` set to `true`.',
            'Make sure to load the browser side of the plugin.'
        );
    });
}
~~~

As we can see, the code initializes a [Repage](https://github.com/reframejs/reframe/tree/master/helpers/repage) instance and calls `@repage/browser`'s `hydratePage()` function.

Instead of using Repage we can manually hydrate the page ourselves.
The following is an example of doing so.
At this point, our browser JavaScript doesn't depend on Reframe nor on Repage.
It is fully under our control.

~~~js
// /examples/custom/browser/pages/custom-hydration.js

import React from 'react';
import TimeComponent from '../../../basics/views/TimeComponent';

export default {
    route: '/custom-hydration',
    browserEntry: {
        pathToEntry: './custom-hydration.entry.js',
        doNotIncludePageConfig: true,
    },
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
};
~~~
~~~js
// /examples/custom/browser/pages/custom-hydration.entry.js

import React from 'react';
import ReactDOM from 'react-dom';

import TimeComponent from '../../../basics/views/TimeComponent';

ReactDOM.hydrate(<TimeComponent/>, document.getElementById('time-hook'));
~~~

## Custom Build

##### Contents

 - [Webpack Config Modification](#webpack-config-modification)
 - [Full Custom Webpack Config](#full-custom-webpack-config)
 - [Full Build Customization](#full-build-customization)

### Webpack Config Modification

The webpack configuration generated by Reframe can be modified by providing
`webpackServerConfig()` and `webpackBrowserConfig()`
in the `reframe.config.js` file.

~~~js
// reframe.config.js

module.exports = {
    webpackBrowserConfig,
    webpackServerConfig,
};
~~~

The following example uses `webpackBrowserConfig()` to add the PostCSS loader to the configuration.

~~~js
// /examples/custom/build/webpack-config-mod/reframe.config.js

module.exports = {
    webpackBrowserConfig,
};

function webpackBrowserConfig({config}) {
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
~~~

### Full Custom Webpack Config

The
`webpackServerConfig()` and `webpackBrowserConfig()` options
(mentioned in the previous section)
also allows us to use an entire custom webpack configuration.

The only restriction for a fully custom config is that the browser entry file and the corresponding server entry file share the same name prefix.
Reframe can't otherwise know which browser entry is meant for which page config.
For example, a browser entry saved at `/path/to/MyPage.entry.js` would match a page config saved at `/path/to/MyPage.html.js`, because they share the same prefix `MyPage`.

The following is an example for a entirely custom config.

~~~js
// /examples/custom/build/custom-webpack-config/reframe.config.js

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
                plugins: [
                    'babel-plugin-transform-object-rest-spread'
                ].map(require.resolve),
            }
        },
        exclude: [/node_modules/],
    }
];

const webpackBrowserConfig = () => ({
    entry: [
        'babel-polyfill',
        '../../../basics/pages/CounterPage.entry.js',
    ],
    output: {
        publicPath: '/',
        path: __dirname+'/dist/browser',
    },
    module: {rules},
});

const webpackServerConfig = () => ({
    entry: '../../../basics/pages/CounterPage.js',
    target: 'node',
    output: {
        publicPath: '/',
        path: __dirname+'/dist/server',
        libraryTarget: 'commonjs2'
    },
    module: {rules},
});

module.exports = {webpackBrowserConfig, webpackServerConfig};
~~~

### Full Build Customization

By default, Reframe uses webpack.
But we can implement a fully custom build step, which means that we can use a build tool other than webpack.

The following is an example of a custom build step using [Rollup](https://github.com/rollup/rollup) and [Node.js's support for ES modules](https://nodejs.org/api/esm.html) over the --experimental-modules flag.

~~~js
// /examples/custom/build/custom-bundler/server.mjs

import Hapi from 'hapi';
import buildAll from './build-all.mjs';
import getHapiPlugins from '@reframe/server/getHapiPlugins';
/* TODO
import getProjectConfig from '@reframe/utils/getProjectConfig';
import HapiPluginServerRendering from '@reframe/server/HapiPluginServerRendering';
import HapiPluginStaticAssets from '@reframe/server/HapiPluginStaticAssets';
*/

process.on('unhandledRejection', err => {throw err});

startServer();

async function build({onBuild}) {
    const {pages, browserDistPath} = await buildAll();
    onBuild({pages, browserDistPath});
}

async function startServer() {
    const server = Hapi.Server({port: 3000});

    const {HapiPluginReframe} = await getHapiPlugins({build})
    await server.register([
        {plugin: HapiPluginReframe},
    ]);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
}
~~~
~~~js
// /examples/custom/build/custom-bundler/build-all.mjs

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
// /examples/custom/build/custom-bundler/build-script.mjs

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
// /examples/custom/build/custom-bundler/build-html.mjs

import Repage from '@repage/core';
import RepageBuild from '@repage/build';
import RepagePathToRegexp from '@repage/router-path-to-regexp';
import RepageRenderer from '@repage/renderer';
import RepageRendererReact from '@repage/renderer-react';

import getPages from './get-pages.mjs';

import fs from 'fs';
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
        RepagePathToRegexp,
        RepageRenderer,
        RepageRendererReact,
    ]);

    repage.addPages(pages);

    return repage;
}
~~~
~~~js
// /examples/custom/build/custom-bundler/get-pages.mjs

import HelloPage from './pages/hello.mjs';
import LandingPage from './pages/landing.mjs';
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

Reframe is built on top of [Repage](https://github.com/reframejs/reframe/tree/master/helpers/repage),
a low-level plugin-based page management library,
and you can use Reframe with a custom Repage instance.

To do so,
and as shown in the example below,
we export a `getRepageInstance` function
that returns the Repage instance we want to use
in the `reframe.config.js` file.

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

As shown in this document, every part of Reframe can be re-written to depend on `@repage` packages only.
And [Repage](https://github.com/reframejs/reframe/tree/master/helpers/repage) can progressively be overwritten over time as well.
This means that we can eventually and over time get rid of the entire Reframe code and the entire Repage code.

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
