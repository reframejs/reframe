const React = require('react');

const Link = ({pathname}) => (
    <div>
        <a href={pathname}>{pathname}</a>
    </div>
);

const LandingComponent = () => (
    <div>
        <Link pathname={'/hello/lisa'}/>
        <Link pathname={'/time'}/>
        <Link pathname={'/about'}/>
    </div>
);

const LandingPage = {
    route: '/',
    view: LandingComponent,
};

module.exports = LandingPage;
