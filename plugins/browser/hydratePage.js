import getProjectBrowserConfig from '@reframe/utils/process-config/getProjectBrowserConfig';
import hydratePage__repage from '@brillout/repage/hydratePage';

async function hydratePage(pageConfig) {
    const projectBrowserConfig = getProjectBrowserConfig();

    const {renderToDom, router, currentPageConfig} = projectBrowserConfig;

    await (
        hydratePage__repage({
            pageConfig: pageConfig || currentPageConfig,
            router,
            renderToDom,
        })
    );
}

export default hydratePage;
