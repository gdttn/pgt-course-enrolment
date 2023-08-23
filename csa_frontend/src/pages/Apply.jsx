import React, { useState, useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Catalog from "../data/course_catalog.json";
import SemesterConfig from "../data/semester_config.json";

import CourseCard from "../components/CourseCard";
import ReviewModal from "../components/ReviewModal";
import FloatingBox from "../components/FloatingBox";

const Apply = ({ course }) => {
  // ------------------ React Router ------------------
  const [data, setData] = useState({});
  const [showModal, setShowModal] = useState(false);

  // ------------------ Toastify ------------------
  const notifyWarning = () =>
    toast.info("Please select courses within the credit limit.");
  const validationWarning = () =>
    toast.warn("Please check your name and UUN. ");
  const coursesWarning = () =>
    toast.warn(
      "Please make sure you have selected courses within the correct credit range."
    );
  const emptyWarning = () =>
    toast.warn("Please note that the selection is empty");
  const minimumCreditWarning = (credits) =>
    toast.warn(`Please select exactly ${credits} credits.`);
  const semesterWarning = () =>
    toast.warn("Credits per semester should be within 50-70 range.");

  // user's information
  const [name, setName] = useState("");
  const [uun, setUun] = useState("");

  // course information
  const [compulsoryCourses, setCompulsoryCourses] = useState({});
  const [optionalCourses, setOptionalCourses] = useState({});
  const [semTotals, setsemTotals] = useState([0, 0]);
  const [optionalLevelCredits, setOptionalLevelCredits] = useState(0);
  const [compSemsCredits, setCompSemsCredits] = useState([0, 0]);

  // handle selected courses
  const [selectedCourses, setSelectedCourses] = useState({});
  const [isFullSetion, setIsFullSection] = useState({});
  const [isFull, setIsFull] = useState(false);

  // final details
  const [finalDetails, setFinalDetails] = useState({});

  // ------------------ useEffect() ------------------

  useEffect(() => {
    setIsFull(false);
  }, []);

  useEffect(() => {
    const loadData = async (dataFilePath) => {
      const { default: json } = await import(`../data/${dataFilePath}.json`);
      return json;
    };

    loadData(course).then((data) => setData(data));
  }, [course]);

  useEffect(() => {
    setCompulsoryCourses(data["compulsory_courses"]);
    setOptionalCourses(data["optional_courses"]);
    data["optional_courses_total_credit"];

    // set selected course struct
    const stemp = {};
    for (const i in data["optional_courses"]) {
      stemp[parseInt(i)] = [];
    }
    setSelectedCourses(stemp);

    // create optional courses sections.
    const temp = {};
    for (const i in data["optional_courses"]) {
      temp[parseInt(i)] = false;
    }
    setIsFullSection(temp);
  }, [data]);

  useEffect(() => {
    let totCredit = calculateTotalOptCredits();
    setsemTotals(calcSemesterCredits());

    if (totCredit[0] == 0) {
      setOptionalLevelCredits(totCredit[1]);
      setIsFull(false);
    } else if (totCredit[0] == 1) {
      setOptionalLevelCredits(totCredit[1]);
      setIsFull(true);
    } else if (totCredit[0] == -1) {
      setOptionalLevelCredits(totCredit[1]);
      setIsFull(true);
    } else {
      setOptionalLevelCredits(0);
    }
  }, [selectedCourses]);

  useEffect(() => {
    if (compulsoryCourses != undefined || compulsoryCourses != null) {
      let sems = addCompulsorySemesterCredits();
      setsemTotals(sems);
      setCompSemsCredits(sems);
    }
  }, [compulsoryCourses]);

  // ------------------ Functions ------------------

  // use to handle selected courses.
  const handleSelectedState = (optional_course_category, cid) => {
    if (typeof selectedCourses[optional_course_category] !== "undefined") {
      if (selectedCourses[optional_course_category].includes(cid)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  // Use to handle the full state after selecting a course
  const handleActiveState = (optional_course_category, cid) => {
    if (isFullSetion[optional_course_category]) {
      if (typeof selectedCourses[optional_course_category] !== "undefined") {
        if (selectedCourses[optional_course_category].includes(cid)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  // Use to handle the full state after selecting a course
  const handleFullActiveState = (optional_course_category, cid) => {
    if (isFull) {
      if (selectedCourses[optional_course_category].includes(cid)) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  // add compulsory semester credits to
  const addCompulsorySemesterCredits = () => {
    let sem01 = 0;
    let sem02 = 0;
    Object.entries(compulsoryCourses).map(([key, cid]) => {
      let isDissertation = Catalog[cid]["course_name"].includes("Dissertation");
      if (!isDissertation) {
        let sem = Catalog[cid]["semester"];
        sem01 += Catalog[cid]["credits"] * SemesterConfig["type"][sem]["sem01"];
        sem02 += Catalog[cid]["credits"] * SemesterConfig["type"][sem]["sem02"];
      }
    });
    return [sem01, sem02];
  };

  // ----------------- Utility Functions -----------------

  // calculate total credits in the selected course list
  const calculateTotalCreditCatagory = (catID) => {
    let total = 0;
    for (const element of selectedCourses[catID]) {
      total += Catalog[element]["credits"];
    }
    return total;
  };

  const calculateTotalOptCredits = () => {
    const optCredit = parseInt(data["optional_courses_total_credit"]);

    let total = 0;
    Object.keys(selectedCourses).forEach((key) => {
      total += parseInt(calculateTotalCreditCatagory(key));
    });

    if (isNaN(optCredit)) {
      return -2;
    } else {
      if (total < optCredit) {
        // not full
        return [0, total];
      } else if (total == optCredit) {
        // full
        return [1, total];
      } else {
        // over
        return [-1, total];
      }
    }
  };

  // onClick handler for course card
  const handleSelectedCourse = (optional_course_category, cid) => {
    // get low and high credit ranges
    const low =
      optionalCourses[optional_course_category]["credit_range"]["min_credit"];
    const high =
      optionalCourses[optional_course_category]["credit_range"]["max_credit"];

    // Check full
    const optTotal = parseInt(data["optional_courses_total_credit"]);
    const currentTotal = calculateTotalOptCredits();

    if (typeof selectedCourses[optional_course_category] !== "undefined") {
      // course is already in the selectedCourses list
      if (selectedCourses[optional_course_category].includes(cid)) {
        // set the section full to false
        setIsFullSection((prev) => ({
          ...prev,
          [optional_course_category]: false,
        }));

        // remove the course from the selected list
        setSelectedCourses((prev) => ({
          ...prev,
          [optional_course_category]: [
            ...(prev[optional_course_category] || []).filter(
              (item) => item !== cid
            ),
          ],
        }));

        // set the section full state
        const total = calculateTotalCreditCatagory(optional_course_category);
        if (total > low && total < high && currentTotal[0] != -1) {
          setIsFullSection((prev) => ({
            ...prev,
            [optional_course_category]: false,
          }));
        }
      } else {
        const total = calculateTotalCreditCatagory(optional_course_category);
        if (
          total + Catalog[cid]["credits"] == high &&
          currentTotal[0] != -1 &&
          currentTotal[0] == 0
        ) {
          // Set the overall full state
          if (
            currentTotal[1] + Catalog[cid]["credits"] == optTotal &&
            currentTotal[0] != -1 &&
            currentTotal[0] == 1
          ) {
            setIsFull(true);
          } else {
            if (
              currentTotal[1] + Catalog[cid]["credits"] <= optTotal &&
              currentTotal[0] != -1 &&
              currentTotal[0] == 0
            ) {
              // set the section full state
              setIsFullSection((prev) => ({
                ...prev,
                [optional_course_category]: true,
              }));

              // add the course to the selected list
              setSelectedCourses((prev) => ({
                ...prev,
                [optional_course_category]: [
                  ...(prev[optional_course_category] || []),
                  cid,
                ],
              }));
            } else {
              notifyWarning();
              return;
            }
          }
        } else if (
          total + Catalog[cid]["credits"] > high ||
          currentTotal[1] + Catalog[cid]["credits"] > optTotal ||
          currentTotal[0] == -1
        ) {
          notifyWarning();
          return;
        } else {
          if (currentTotal[0] != -1) {
            setSelectedCourses((prev) => ({
              ...prev,
              [optional_course_category]: [
                ...(prev[optional_course_category] || []),
                cid,
              ],
            }));
          } else {
            notifyWarning();
            return;
          }
        }
      }
    } else {
      console.log("Please relode the page and try again.");
    }
  };

  // calculate the semester credits
  const calcSemesterCredits = () => {
    let sem01 = compSemsCredits[0];
    let sem02 = compSemsCredits[1];

    const creditBySemester = (cid, semester) => {
      sem01 +=
        Catalog[cid]["credits"] * SemesterConfig["type"][semester]["sem01"];
      sem02 +=
        Catalog[cid]["credits"] * SemesterConfig["type"][semester]["sem02"];
    };

    Object.entries(selectedCourses).map(([key, value]) => {
      value.map((cid) => {
        const semester = Catalog[cid]["semester"];
        creditBySemester(cid, semester);
      });
    });

    return [sem01, sem02];
  };

  // ------------------ Handle Submit ------------------

  const handleReview = (e) => {
    e.preventDefault();

    if (!validateName(name) || !validateUUN(uun)) {
      validationWarning();
      return;
    }

    if (!validateCourses()) {
      coursesWarning();
      return;
    }

    if (checkSelectedCourseEmpty()) {
      emptyWarning();
      return;
    }

    if (checkMinimumTotalCredits()) {
      minimumCreditWarning(data["optional_courses_total_credit"]);
      return;
    }

    if (!semesterCourses()) {
      semesterWarning();
      return;
    }

    setFinalDetails({
      student_name: name,
      uun: uun,
      course_name: data["course_name"],
      course_year: data["year"],
      compulsory_courses: compulsoryCourses,
      selected_courses: selectedCourses,
    });
    setShowModal(true);
  };

  // --------------- Validation Functions ---------------
  const validateName = (name) => {
    if (name.length < 3) {
      return false;
    } else {
      return true;
    }
  };

  const validateUUN = (uun) => {
    if (uun.length != 8 || !(uun.startsWith("s") || uun.startsWith("S"))) {
      return false;
    } else {
      return true;
    }
  };

  const validateCourses = () => {
    if (Object.keys(selectedCourses).length == 0) {
      return false;
    } else {
      let flag = true;
      Object.keys(selectedCourses).forEach((key) => {
        const min = parseInt(
          optionalCourses[key]["credit_range"]["min_credit"]
        );
        const max = parseInt(
          optionalCourses[key]["credit_range"]["max_credit"]
        );
        const total = parseInt(calculateTotalCreditCatagory(key));
        if (total < min || total > max) {
          flag = flag && false;
        } else if (total == min || total == max) {
          flag = flag && true;
        } else if (total > min && total < max) {
          flag = flag && true;
        } else {
          flag = flag && false;
        }
      });
      return flag;
    }
  };

  const checkSelectedCourseEmpty = () => {
    if (Object.keys(selectedCourses).length == 0) {
      return true;
    } else {
      let flag = false;
      let stat = [];
      Object.entries(selectedCourses).map(([key, value]) => {
        if (
          value.length == 0 &&
          !parseInt(optionalCourses[key]["credit_range"]["min_credit"]) == 0
        ) {
          stat.push(true);
        }
      });
      if (stat.length != 0) {
        flag = stat.every((element) => element === true);
      }
      return flag;
    }
  };

  const semesterCourses = () => {
    const COMPULSORY_CREDIT = data["compulsory_courses_total_credit"];
    const TOTAL_SEM_CREDITS = SemesterConfig["total_semester_credit"];
    const MEAN_CREDITS = 60; // data["optional_courses_total_credit"] / 2;

    const sem01Min = SemesterConfig["semester_min_max_values"]["sem01_min"];
    const sem01Max = SemesterConfig["semester_min_max_values"]["sem01_max"];
    const sem02Min = SemesterConfig["semester_min_max_values"]["sem02_min"];
    const sem02Max = SemesterConfig["semester_min_max_values"]["sem02_max"];

    let sem01Total = 0;
    let sem02Total = 0;

    const creditBySemester = (cid, semester) => {
      sem01Total +=
        Catalog[cid]["credits"] * SemesterConfig["type"][semester]["sem01"];
      sem02Total +=
        Catalog[cid]["credits"] * SemesterConfig["type"][semester]["sem02"];
    };

    Object.entries(selectedCourses).map(([key, value]) => {
      value.map((cid) => {
        const semester = Catalog[cid]["semester"];
        creditBySemester(cid, semester);
      });
    });

    if (COMPULSORY_CREDIT - 60 + sem01Total + sem02Total == TOTAL_SEM_CREDITS) {
      if (
        (sem01Total + compSemsCredits[0] >= MEAN_CREDITS - sem01Min &&
          sem01Total + compSemsCredits[0] <= MEAN_CREDITS + sem01Max) ||
        sem01Total + compSemsCredits[0] == MEAN_CREDITS
      ) {
        if (
          (sem02Total + compSemsCredits[1] >= MEAN_CREDITS - sem02Min &&
            sem02Total + compSemsCredits[1] <= MEAN_CREDITS + sem02Max) ||
          sem02Total + compSemsCredits[1] == MEAN_CREDITS
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const checkMinimumTotalCredits = () => {
    const CREDIT_LIMIT = 180;
    const compCredit = parseInt(data["compulsory_courses_total_credit"]);
    const optCredit = parseInt(data["optional_courses_total_credit"]);

    // Calculate total credits in the selected courses
    let total = 0;
    Object.keys(selectedCourses).forEach((key) => {
      total += parseInt(calculateTotalCreditCatagory(key));
    });

    if (total < optCredit) {
      let diff = optCredit - total;

      // Check if level credits are less than the difference
      if (diff > optCredit) {
        return false;
      } else {
        return true;
      }
    } else if (total == optCredit) {
      return false;
    } else {
    }

    if (compCredit + total == CREDIT_LIMIT) {
      return true;
    } else {
      return false;
    }
  };

  // ------------------ Render ------------------
  if (compulsoryCourses == undefined || optionalCourses == undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center ">
      {showModal ? (
        <ReviewModal
          responseData={finalDetails}
          modalToggle={setShowModal}
          programData={data}
        />
      ) : null}
      <FloatingBox
        credits={
          optionalLevelCredits +
          parseInt(data["compulsory_courses_total_credit"])
        }
        semesterTot={semTotals}
        position={"right"}
      />
      <FloatingBox
        credits={
          optionalLevelCredits +
          parseInt(data["compulsory_courses_total_credit"])
        }
        semesterTot={semTotals}
        position={"left"}
      />
      <div className="container mx-auto px-6 py-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center pb-4">
          <div className="flex flex-col align-middle justify-center">
            <h2 className="font-extrabold sm:text-3xl text-darkBlue leading-tight pr-4">
              Informatics Course Enrolment Form - 2023/24
            </h2>
            <h1 className="text-darkBlue  py-2 text-2xl font-bold">
              {data["course_name"]}
            </h1>
          </div>
          <img
            className="h-auto max-w-sm hidden xs:block"
            src="/edin-informatics-logo.png"
          />
        </div>
        <hr className="h-px border-0 bg-gray-700" />
        <form>
          {data["diet_note"] !== "" && (
            <div className="py-4 whitespace-pre-wrap">
              <h3 className="font-bold  text-darkBlue">Note: </h3>
              <p className=" text-darkBlue text-justify">{data["diet_note"]}</p>
            </div>
          )}
          <div />
          <hr />
          <div id="student-details" className="pt-8">
            <div className="rounded-lg shadow-lg bg-gray-100 overflow-hidden p-4 pb-6">
              <h3 className=" text-darkBlue text-2xl font-bold pb-2">
                Student Details
              </h3>
              <hr />
              <div className="grid grid-cols-2 gap-5 mt-3">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-bold text-darkBlue py-2"
                  >
                    Full Name :{" "}
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="bg-white text-darkBlue w-4/5 border-gray-300 rounded-md shadow-md focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm py-2 px-3 "
                    name="name"
                    placeholder="Your name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="uun"
                    className="block font-bold text-darkBlue py-2"
                  >
                    UUN (Student Number) :{" "}
                  </label>
                  <input
                    id="uun"
                    type="text"
                    name="uun"
                    className="bg-white text-darkBlue w-4/5 border-gray-300 rounded-md shadow-md focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm py-2 px-3"
                    placeholder="(sxxxxxxx)"
                    onChange={(e) => {
                      setUun(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div id="course-selection" className="mt-16">
            <div id="compulsory-courses" className="mt-4">
              <div className="rounded-lg shadow-lg bg-gray-100 overflow-hidden p-4 pb-6 mb-8">
                <h3 className=" text-darkBlue text-2xl font-bold pb-2">
                  Compulsory Courses
                </h3>
                <hr />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                  {Object.entries(compulsoryCourses).map(([key, value]) => (
                    <CourseCard
                      key={value}
                      courseName={Catalog[value]["course_name"]}
                      semester={Catalog[value]["semester"]}
                      courseCode={value}
                      url={Catalog[value]["url"]}
                      note={Catalog[value]["note"]}
                      courseCredit={Catalog[value]["credits"]}
                      isDefault={true}
                      isActive={true}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-lg shadow-lg bg-gray-100 overflow-hidden p-4 pb-6 mt-16">
                <h3 className=" text-darkBlue text-2xl font-bold py-2">
                  Optional Courses
                </h3>
                <hr />
                <div className="flex justify-between bg-gray-300 text-lg p-1 rounded-lg  mt-5">
                  <h3 className="text-md text-darkBlue">
                    <span className="text-md text-darkBlue">
                      GROUP A: Select exactly{" "}
                    </span>
                    <span className="font-bold text-red-800">
                      {data["optional_courses_total_credit"]}
                    </span>{" "}
                    credits in this group.
                  </h3>{" "}
                  <span className="text-darkBlue font-bold">
                    ({optionalLevelCredits}/
                    {data["optional_courses_total_credit"]})
                  </span>
                </div>

                {Object.entries(optionalCourses).map(
                  ([optional_course_category, value]) => (
                    <div key={optional_course_category}>
                      <h2 className="text-gray-700 font-bold pb-2 pt-5">
                        {value["course_type"]}
                      </h2>
                      <h3 className="text-gray-700">
                        Select between{" "}
                        <b> {value["credit_range"]["min_credit"]} </b> and{" "}
                        <b>{value["credit_range"]["max_credit"]} </b> credits of
                        the following courses
                      </h3>

                      {value["course_note"] ? (
                        <div className="py-1">
                          <p className="pt-2 text-sm text-gray-700 font-bold">
                            Notes:
                          </p>
                          <h4 className="text-sm text-gray-700">
                            {value["course_note"]}
                          </h4>
                        </div>
                      ) : null}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                        {Object.entries(value["courses"]).map(
                          ([key, value]) => (
                            <CourseCard
                              key={value}
                              onClickHandler={handleSelectedCourse}
                              optCat={optional_course_category}
                              courseName={Catalog[value]["course_name"]}
                              semester={Catalog[value]["semester"]}
                              url={Catalog[value]["url"]}
                              note={Catalog[value]["note"]}
                              courseCode={value}
                              courseCredit={Catalog[value]["credits"]}
                              isDefault={false}
                              isActive={
                                isFull
                                  ? handleFullActiveState(
                                      optional_course_category,
                                      value
                                    )
                                  : handleActiveState(
                                      optional_course_category,
                                      value
                                    )
                              }
                              isSelected={handleSelectedState(
                                optional_course_category,
                                value
                              )}
                            />
                          )
                        )}
                      </div>
                      <hr className="mt-7" />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center my-5">
            <button
              className="bg-emerald-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={handleReview}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Apply;
