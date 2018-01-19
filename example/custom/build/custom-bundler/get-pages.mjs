import HelloPage from './pages/hello.html';

export default getPages;

function getPages() {
    const pages = (
        [
         // {pageObject: LandingPage, pageName: 'landing'},
            {pageObject: HelloPage, pageName: 'hello'},
        ]
        .map(({pageObject, pageName}) => {
            const scripts = pageObject.scripts || [];
            scripts.push({
                diskPath: './pages/'+pageName+'.entry.js',
                src: '/'+pageName+'-bundle.js',
                bundleName: pageName+'Bundle',
            });
            return {...pageObject, scripts};
        })
    );

    return pages;
}
