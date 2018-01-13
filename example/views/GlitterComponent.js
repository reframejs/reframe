import React from 'react';
import './GlitterStyle.css';
import './Tangerine.ttf';
import diamondUrl from './diamond.png';

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

const Diamond = () => <div className="diamond diamond-background"/>;

const GlitterComponent = () => (
    <Center style={{fontSize: '2em'}}>
        <Diamond/>
        I'm shiny
        <img className='diamond' src={diamondUrl}/>
    </Center>
);

export {GlitterComponent};
