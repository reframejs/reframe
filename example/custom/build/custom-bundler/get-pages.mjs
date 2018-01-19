import HelloPage from './pages/hello.html';

export default getPages;

function getPages() {
    const pages = (
        [
            HelloPage,
        ]
        .map(pageObject => {
            pageObject.scripts = pageObject.scripts || [];
            pageObject.scripts.push({src: '/bundle.js'});
            return pageObject;
        })
    );

    return pages;
}
