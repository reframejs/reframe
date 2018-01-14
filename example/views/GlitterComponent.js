import React from 'react';
import './GlitterStyle.css';
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
        Shine
        <img className='diamond' src={diamondUrl}/>
    </Center>
);

export {GlitterComponent};
