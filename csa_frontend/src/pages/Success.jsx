import React from "react";
import { useLocation } from "react-router-dom";

const Success = () => {
  const data = useLocation();
  return (
    <div className="flex flex-col items-center">
      <div className="text-xl">Thank you! Your request is Successful!</div>
      {/* To-do : Waiting for the final text to be given to replace */}
      <div className="text-md">
        <a href={data.state.data} target="_blank">
          {data.state.data}
        </a>
      </div>
    </div>
  );
};

export default Success;
