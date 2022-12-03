import React from 'react';

const Unavailable = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
    }}>
      <h1>Sorry</h1>
      <p>Service currently unavailable</p>
      <p>Please, try again later</p>
    </div>
  );
};

export default Unavailable;
