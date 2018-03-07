import HelloPage from './hello.mjs';

import Repage from '@repage/core';

import RepageRenderer from '@repage/renderer';
import RepageRendererReact from '@repage/renderer-react';
import RepageRouterPathToRegexp from '@repage/router-path-to-regexp';
import RepageNavigator from '@repage/navigator';

import hydratePage from '@repage/browser/hydratePage';


const repage = new Repage();

repage.addPlugins([
    RepageRenderer,
    RepageRendererReact,
    RepageRouterPathToRegexp,
    RepageNavigator,
]);

(async () => {
    await hydratePage(repage, HelloPage);
})();
