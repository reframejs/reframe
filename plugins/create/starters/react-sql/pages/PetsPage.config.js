import React from 'react';
import {endpoints} from 'wildcard-api/client';

const Pets = ({person, pets}) => (
    <div>
      <div>{
        person.name+"'s pets:"
      }</div>
      <div>{
        pets.map(pet =>
          <div key={pet.id}>{pet.name}</div>
        )
      }</div>
    </div>
);

async function getInitialProps({isNodejs, requestContext, route: {args: {personId}}}) {
  let {getPetsPageData} = endpoints;
  if( isNodejs ) getPetsPageData = getPetsPageData.bind(requestContext);
  const {person, pets} = await getPetsPageData(personId);
  return {person, pets};
}

const PersonsPage = {
    route: '/pets/:personId',
    view: Pets,
    title: 'List of pets',
    getInitialProps,
};

export default PersonsPage;
