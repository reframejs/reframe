import React from 'react';

const Link = ({pathname}) => (
    <div>
        <a href={pathname}>{pathname}</a>
    </div>
);

export default {
    route: '/',
    htmlStatic: true,
    domStatic: true,
    view: () => (
        <div>
            <Link pathname={'/news'}/>
            <Link pathname={'/panel'}/>
        </div>
    ),
};
