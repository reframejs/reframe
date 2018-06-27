const React = require('react');

const Section = ({title, children}) => (
    <div>
        <div style={{marginBottom: 2, marginTop: 24}}>{title}</div>
        {children}
    </div>
);

const Link = ({pathname}) => (
    <div>
        <a href={pathname}>{pathname}</a>
    </div>
);

const LandingComponent = () => (
    <div>
        <h3>Reframe examples</h3>

        <Section title={'HTML-static'}>
            <Link pathname={'/'}/>
            <Link pathname={'/about'}/>
        </Section>

        <Section title={'HTML-dynamic'}>
            <Link pathname={'/hello/lisa'}/>
        </Section>

        <Section title={'Static VS Dynamic'}>
            <Link pathname={'/time'}/>
            <Link pathname={'/time/html-static'}/>
            <Link pathname={'/time/html-dynamic'}/>
        </Section>

        <Section title={'CSS & Static Assets'}>
            <Link pathname={'/glitter'}/>
        </Section>

        <Section title={'DOM-dynamic'}>
            <Link pathname={'/counter'}/>
            <Link pathname={'/counter2'}/>
        </Section>

        <Section title={'Async Data'}>
            <Link pathname={'/game-of-thrones'}/>
            <Link pathname={'/game-of-thrones-2'}/>
        </Section>

        <Section title={'Links between pages'}>
            <Link pathname={'/page-a'}/>
            <Link pathname={'/page-b'}/>
        </Section>
    </div>
);

const LandingPage = {
    title: 'Welcome',
    route: '/',
    view: LandingComponent,
    renderHtmlAtBuildTime: true,
    doNotRenderInBrowser: true,
};

module.exports = LandingPage;
