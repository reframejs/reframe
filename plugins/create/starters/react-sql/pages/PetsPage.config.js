import React from 'react';
import {endpoints} from 'wildcard-api/client';

export default {
  route: '/pets/:personId',
  view: Pets,
  title: 'List of pets',
  getInitialProps,
};

function Pets({person, pets}) {
  return <>
    {person.name+"'s pets:"}
    <ul>
      { pets.map(pet =>
        <li key={pet.id}>{pet.name}</li>
      ) }
    </ul>
  </>;
}

async function getInitialProps({isNodejs, requestContext, personId}) {
  let {getPetsPageData} = endpoints;
  if( isNodejs ) getPetsPageData = getPetsPageData.bind(requestContext);
  const {person, pets} = await getPetsPageData(personId);
  return {person, pets};
}
