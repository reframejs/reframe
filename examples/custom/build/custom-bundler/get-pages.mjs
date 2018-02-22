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
