import React from "react";
import { Link } from "react-router-dom";

import data from "../data/courses.json";

const Landing = () => {
  let link = "";
  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <h1 className="text-lg p-5"> Select the program </h1>
      </div>
      <div>
        {data.map(
          (item, index) => (
            (link = `/${item.value}`),
            (
              <Link key={index} to={link}>
                <button className="block w-full m-2 py-2 text-left text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
                  {item.label}
                </button>
              </Link>
            )
          )
        )}
      </div>
    </div>
  );
};

export default Landing;
