import React from 'react'
import decodeToken from '../decodedDetails';

function InterviewHome() {
  const userData=decodeToken();

 
  return (
    <div>
       <h2>I{`interview ${userData.name}`}</h2>
    </div>
  )
}

export default InterviewHome
