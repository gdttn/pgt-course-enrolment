function CourseCard({
  courseCode,
  courseName,
  optCat,
  courseCredit,
  semester,
  url,
  isDefault,
  isActive,
  isSelected,
  onClickHandler,
  note,
}) {
  return (
    <div>
      {isDefault ? (
        <div
          className={` rounded-lg items-center ring-1 ring-gray-400 ring-offset-1 space-x-2 mt-2 bg-white cursor-default shadow-md `}
        >
          <div className="flex flex-row flex-wrap">
            <div className="w-full lg:w-full">
              <div className="rounded-t-lg p-1 bg-gray-100">
                <a
                  href={url}
                  className="text-blue-600 text-sm  py-1 px-2"
                  target="_blank"
                >
                  {courseCode}
                </a>
                <span className="text-darkBlue text-sm font-bold rounded-md py-1 px-2 ">
                  {courseName}
                </span>
              </div>
            </div>

            <div className="w-full  lg:w-1/6 p-2 my-1">
              <div
                className={`flex h-6 w-6 rounded-full border-2 border-blue-500 place-content-center `}
              >
                <svg
                  className={`visible rounded-full h-6 w-6 text-blue-500 place-self-center`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="flex w-full lg:w-5/6 p-2 my-1">
              <div className="text-darkBlue text-xs rounded-full py-1 px-2 mr-2 bg-slate-200 align-bottom">
                {courseCredit} Credits
              </div>{" "}
              <div className="text-darkBlue text-xs rounded-full py-1 px-2 bg-slate-200 align-bottom">
                {semester}
              </div>
            </div>
          </div>
        </div>
      ) : isActive ? (
        <div
          onClick={() => onClickHandler(optCat, courseCode)}
          className={`flex flex-col rounded-md p-1
           my-2 ${
             isSelected
               ? "ring-4 ring-green-200 ring-offset-1 text-green-700 bg-green-100"
               : " bg-white"
           } ${
            isDefault ? "cursor-default " : "cursor-pointer "
          } shadow-xl ring-1 ring-gray-300 ring-offset-2`}
        >
          <div className="flex flex-grow space-x-2 p-1 items-center">
            <div
              className={`flex h-6 w-6 rounded-full border-2  place-content-center ${
                isSelected
                  ? " bg-green-400 border-green-400"
                  : "border-gray-500 "
              } `}
            >
              <svg
                className={`${isSelected ? "visible" : "invisible"} ${
                  isDefault ? "visible bg-slate-200" : ""
                } rounded-full h-6 w-6 text-white place-self-center`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                ></path>
              </svg>
            </div>

            <div className="flex flex-col flex-grow rounded-full items-baseline ">
              <div className="flex flex-grow space-x-2">
                <div className="text-darkBlue text-xs font-bold rounded-full py-1 px-2 bg-slate-200 ">
                  {courseName}
                </div>
              </div>

              <div className="md:flex flex-grow space-x-2 py-1">
                <div className="text-darkBlue text-xs font-bold rounded-full py-1 px-2 bg-slate-200">
                  <a href={url} target="_blank">
                    {courseCode}
                  </a>
                </div>
                <div className="text-darkBlue text-xs rounded-full py-1 px-2 bg-slate-200 align-bottom">
                  {courseCredit} Credits
                </div>
                <div className="text-darkBlue text-xs rounded-full py-1 px-2 bg-slate-200 align-bottom">
                  {semester}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-col rounded-md p-1
           my-2 "cursor-default" shadow-md bg-slate-300`}
        >
          <div className="flex flex-grow space-x-2 items-center p-1">
            <div
              className={`flex h-6 w-6 rounded-full border-2 place-content-center border-black
            `}
            ></div>

            <div className="flex flex-grow flex-col items-baseline">
              <div className="flex flex-grow h-6 rounded-full items-center space-x-2">
                <div className="text-darkBlue text-xs font-bold rounded-full py-1 px-2 bg-slate-300 ">
                  {courseName}
                </div>
              </div>
              <div className="flex flex-grow py-1 space-x-2">
                <div className="text-darkBlue text-xs rounded-full py-1 px-2 bg-slate-200">
                  <a href={url} target="_blank">
                    {courseCode}
                  </a>
                </div>
                <div className="text-darkBlue text-xs rounded-full py-1 px-2 bg-slate-200 align-bottom">
                  {courseCredit} Credits
                </div>
                <div className="text-darkBlue text-xs rounded-full py-1 px-2 bg-slate-200 align-bottom">
                  {semester}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseCard;