import HelloPage from './pages/hello.html.mjs';
import LandingPage from './pages/landing.html.mjs';

export default getPages;

function getPages() {
    const pages = (
        [
            {pageObject: LandingPage, pageName: 'landing'},
            {pageObject: HelloPage, pageName: 'hello'},
        ]
        .map(({pageObject, pageName}) => {
            const scripts = pageObject.scripts || [];
            scripts.push({
                diskPath: './pages/'+pageName+'.entry.js',
                src: '/'+pageName+'-bundle.js',
                bundleName: pageName+'Bundle',
                _options: {skipAttributes: ['diskPath', 'bundleName']},
            });
            return {...pageObject, scripts};
        })
    );

    return pages;
}
