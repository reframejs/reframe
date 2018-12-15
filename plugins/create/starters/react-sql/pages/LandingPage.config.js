import React from 'react';
import {endpoints} from 'wildcard-api/client';

const Persons = ({persons}) => <>
  Persons:
  <ul>
    { persons.map(person =>
      <li key={person.id}>
        <a href={"/pets/"+person.id}>
          {person.name}
        </a>
      </li>
    ) }
  </ul>
</>;

async function getInitialProps({isNodejs, requestContext}) {
  let {getLandingPageData} = endpoints;
  if( isNodejs ) getLandingPageData = getLandingPageData.bind(requestContext);
  const {persons} = await getLandingPageData();
  return {persons};
}

const PersonsPage = {
    route: '/',
    view: Persons,
    title: 'List of persons',
    getInitialProps,
};

export default PersonsPage;
