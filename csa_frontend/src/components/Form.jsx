import { useState } from "react";
import Catalog from "../data/course_catalog.json";

import CourseCard from "./CourseCard";

function Form({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [fieldData, setFieldData] = useState(null);

  // course data
  const [compulsoryCourses, setCompulsoryCourses] = useState({});
  const [optionalCourses, setOptionalCourses] = useState({});
  const [optionalLevelCourses, setOptionalLevelCourses] = useState({});

  // handle selected courses
  const [selectedCourses, setSelectedCourses] = useState({});
  const [isFullSetion, setIsFullSection] = useState({});

  const handleSelectField = async (index) => {
    setSelectedField(index);
    setIsOpen(false);
    const dataFile = data[index].value;
    const { default: json } = await import(`../data/${dataFile}.json`);
    setCompulsoryCourses(json["compulsory_courses"]);
    setOptionalCourses(json["optional_courses"]);
    setOptionalLevelCourses(json["optional_courses_levls"]);

    // reset selected courses
    setSelectedCourses({});
    setIsFullSection({});

    // create optional courses sections.
    const temp = {};
    for (const i in Object.keys(json["optional_courses"])) {
      temp[parseInt(i) + 1] = false;
    }
    setIsFullSection(temp);

    setFieldData(json);
  };

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

  // calculate total credits in the selected course list
  const calculateTotalCredits = (catID) => {
    let total = 0;
    for (const element of selectedCourses[catID]) {
      total += Catalog[element]["credits"];
    }
    return total;
  };

  // onClick handler for course card
  const handleSelectedCourse = (optional_course_category, cid) => {
    // low and high credit ranges
    const low =
      optionalCourses[optional_course_category]["credit_range"]["min_credit"];
    const high =
      optionalCourses[optional_course_category]["credit_range"]["max_credit"];

    if (typeof selectedCourses[optional_course_category] !== "undefined") {
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

        const total = calculateTotalCredits(optional_course_category);
        if (total < low) {
          setIsFullSection((prev) => ({
            ...prev,
            [optional_course_category]: false,
          }));
        }
      } else {
        const total = calculateTotalCredits(optional_course_category);
        if (total + Catalog[cid]["credits"] == high) {
          setIsFullSection((prev) => ({
            ...prev,
            [optional_course_category]: true,
          }));

          setSelectedCourses((prev) => ({
            ...prev,
            [optional_course_category]: [
              ...(prev[optional_course_category] || []),
              cid,
            ],
          }));
        } else if (total + Catalog[cid]["credits"] > high) {
          return;
        } else {
          setSelectedCourses((prev) => ({
            ...prev,
            [optional_course_category]: [
              ...(prev[optional_course_category] || []),
              cid,
            ],
          }));
        }
      }
    } else {
      if (Catalog[cid]["credits"] >= high) {
        setSelectedCourses((prev) => ({
          ...prev,
          [optional_course_category]: [cid],
        }));
        setIsFullSection((prev) => ({
          ...prev,
          [optional_course_category]: true,
        }));
      } else {
        setSelectedCourses((prev) => ({
          ...prev,
          [optional_course_category]: [cid],
        }));
      }
    }
  };

  const handleSumbit = () => {
    console.log("submit");
  };

  return (
    <div className="relative">
      <button
        className="block w-full py-2 text-left text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedField !== null ? data[selectedField].label : "Select a field"}
      </button>
      {isOpen && (
        <div className="absolute top-0 left-0 z-10 w-full py-2 mt-1 bg-white rounded-md shadow-lg">
          {data.map((item, index) => (
            <button
              key={index}
              className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              onClick={() => handleSelectField(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      {selectedField !== null && fieldData && (
        <div className="mt-2">
          <h2>{fieldData["course_name"]}</h2>
          <h3>Compulsory Courses</h3>
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

          <h3>Optional Courses</h3>
          {Object.entries(optionalCourses).map(
            ([optional_course_category, value]) => (
              <div key={optional_course_category}>
                <h2>{value["course_type"]}</h2>
                <h3>{value["credit_range"]["min_credit"]}</h3>
                <h3>{value["credit_range"]["max_credit"]}</h3>
                {Object.entries(value["courses"]).map(([key, value]) => (
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
                    isActive={handleActiveState(
                      optional_course_category,
                      value
                    )}
                    isSelected={handleSelectedState(
                      optional_course_category,
                      value
                    )}
                  />
                ))}
                <hr />
              </div>
            )
          )}

          {Object.entries(selectedCourses).map(([key, value]) => (
            <div key={key + value}>
              <h2>{key}</h2>
              <h2>{JSON.stringify(value)}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Form;
