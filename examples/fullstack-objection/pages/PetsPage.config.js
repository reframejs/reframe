import React from 'react';
import {endpoints} from 'wildcard-api/client';

export default {
  route: '/pets/:personId',
  view: Pets,
  getInitialProps,
};

function Pets({person, pets}) {
  return (
    <div>
      {person.name}'s pets:
      { pets.map(pet =>
        <div key={pet.id}>{pet.name}</div>
      ) }
    </div>
  );
}

async function getInitialProps({personId}) {
  const {person, pets} = await endpoints.getPetsPageData(personId);
  return {person, pets};
}
