import React from 'react';
import './GlitterStyle.css';
import './Tangerine.ttf';
import diamondUrl from './diamond.png';

console.log(diamondUrl);

const Center = ({children, style}) => (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', ...style
      }}
    >
        {children}
    </div>
);

const GlitterComponent = () => (
    <Center style={{fontSize: '2em'}}>
        I'm shiny <img src={diamondUrl}/>
    </Center>
);

export {GlitterComponent};
