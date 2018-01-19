import HelloPage from './pages/hello.html';

export default getPages;

function getPages() {
    const pages = (
        [
            HelloPage,
        ]
        .map(pageObject => {
            const scripts = pageObject.scripts || [];
            scripts.push({src: '/bundle.js'});
            return {...pageObject, scripts};
        })
    );

    return pages;
}
