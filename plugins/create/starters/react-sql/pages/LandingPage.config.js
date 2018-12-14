import React from 'react';
import {endpoints} from 'wildcard-api/client';

const Persons = ({persons}) => (
    <div>{
      persons.map(person =>
        <div key={person.id}>
          <a href={"/pets/"+person.id}>
            {person.name}
          </a>
        </div>
      )
    }</div>
);

async function getInitialProps({isNodejs, requestContext}) {
  let {getLandingPageData} = endpoints;
  if( isNodejs ) getLandingPageData = getLandingPageData.bind(requestContext);
  return getLandingPageData();
}

const PersonsPage = {
    route: '/',
    view: Persons,
    title: 'List of persons',
    getInitialProps,
};

export default PersonsPage;
