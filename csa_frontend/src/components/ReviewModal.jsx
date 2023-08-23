import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import LoadingSpinner from "./LoadingSpinner";
import useOnClickOutside from "../hooks/useOnClickOutside";

const ReviewModal = ({ responseData, modalToggle, programData }) => {
  const [loadingState, setLoadingState] = useState(false);
  const modRef = useRef();
  const navigate = useNavigate();
  const B_URL = "http://csa_frontend:3001/send";

  useOnClickOutside(modRef, () => modalToggle(false));

  async function sendEmail(jsonObj) {
    Object.entries(jsonObj["selected_courses"]).map(([key, value]) => {
      let temp = jsonObj["selected_courses"][key] || [];
      jsonObj["selected_courses"][key] = {
        catagory: programData["optional_courses"][key]["course_type"],
        courses: temp,
      };
    });

    try {
      setLoadingState(true);
      await axios
        .post(B_URL, jsonObj, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setLoadingState(false);
          navigate("/success", { state: { data: response.data["url"] } });
        });
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  }

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    sendEmail(responseData);
  };

  return (
    <div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl" ref={modRef}>
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {loadingState ? (
              <div className="w-auto h-auto">
                <LoadingSpinner />
              </div>
            ) : (
              <div>
                {/*header*/}
                <div className=" p-2 text-center text-gray-700 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-xl font-semibold">Please Confirm</h3>
                  <button
                    className="p-1 ml-auto bg-transparent z-20 border-0 text-darkBlue opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => modalToggle(false)}
                  >
                    <span className="bg-transparent text-darkBlue opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="text-darkBlue p-2">
                  <p className="text-m text-gray-700 py-1">
                    <span className=" font-bold">Degree :</span>{" "}
                    {responseData["course_name"]}
                  </p>
                  <p className="text-m text-gray-700 py-1">
                    <span className=" font-bold">Full Name:</span>{" "}
                    {responseData["student_name"]}
                  </p>
                  <p className="text-m text-gray-700 py-1">
                    <span className=" font-bold">UUN:</span>{" "}
                    {responseData["uun"]}
                  </p>
                  <p className="text-m text-gray-700 py-1">
                    <span className=" font-bold">Total Credits :</span> 180{" "}
                  </p>
                  <p className="text-m text-red-500 font-bold  py-1">
                    I herewith confirm that the selection is accurate and
                    correct.
                  </p>
                </div>
                <div className="flex items-center justify-end p-3 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => modalToggle(false)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="opacity-30 fixed inset-0 z-40 bg-black"></div>
    </div>
  );
};

export default ReviewModal;
