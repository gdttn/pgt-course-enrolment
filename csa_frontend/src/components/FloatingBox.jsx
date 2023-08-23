import React from "react";

const FloatingBox = ({ credits, semesterTot, position }) => {
  return (
    <div>
      {position=='left' ? (
        <div className="fixed bottom-0 left-0 m-4 p-4 bg-darkBlue bg-opacity-90 text-center text-white font-bold rounded-lg shadow-md">
          {credits} / 180
      <div className="text-xs">Total Credits</div>
      </div>
      ) : (
        <div className="fixed bottom-0 right-0 m-4 p-4 bg-darkBlue bg-opacity-90 text-center text-white font-bold rounded-lg shadow-md">
           <div className="text-xs">
        <span className="font-normal">SEM 01 : <span className="font-bold">{semesterTot[0]}</span></span><br />
        <span className="font-normal">SEM 02 : <span className="font-bold">{semesterTot[1]}</span></span><br/>
        <span className="font-normal">Dissertation : <span className="font-bold">60</span></span>
      </div>
    </div>
      )}
      </div>
      
     
  );
};

export default FloatingBox;
