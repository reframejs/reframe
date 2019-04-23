import React from 'react';
import {endpoints} from 'wildcard-api/client';

export default {
  route: '/',
  view: LandingPage,
  getInitialProps,
};

function LandingPage(props) {
  const {texts} = props;
  return <>
    Texts:
    <ul>
      { texts.map(txt =>
        <li key={txt.id}>
          {txt.content} ({txt.id})
        </li>
      ) }
    </ul>
  </>;
}

async function getInitialProps({isNodejs, requestContext}) {
  let {getAllTextEntries} = endpoints;
  if( isNodejs ) getAllTextEntries = getAllTextEntries.bind(requestContext);
  const texts = await getAllTextEntries();
  return {texts};
}
