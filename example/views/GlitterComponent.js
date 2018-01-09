import React from 'react';
import './GlitterStyle.css';
import './Tangerine.ttf';

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

const Diamond = () => <div className="diamond"/>;

const GlitterComponent = () => (
    <Center style={{fontSize: '2em'}}>
        <Diamond/> I'm shiny <Diamond/>
    </Center>
);

export {GlitterComponent};
