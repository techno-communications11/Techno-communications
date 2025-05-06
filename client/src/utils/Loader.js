import React from 'react';
import './Loader.css'; 
function Loader() {
  return (
    <div className="loader-wrapper">
      <div className="lds-default">
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
      </div>
    </div>
  );
}

export default Loader;
