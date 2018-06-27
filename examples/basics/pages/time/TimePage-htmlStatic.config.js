import TimeComponent from '../../views/TimeComponent';

export default {
    route: '/time/html-static',
    view: TimeComponent,
    renderHtmlAtBuildTime: true,
    doNotRenderInBrowser: true,
};
