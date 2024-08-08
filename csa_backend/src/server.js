const nodemailer = require("nodemailer");
const cors = require("cors");
const parser = require("json2csv");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
  debug: true,
}).parsed;

// Express
const express = require("express");
const app = express();
const port = 3001;

app.use(
  cors({
    origin: ["http://localhost:8080/", "http://localhost:8080"],
  })
);

app.options("*", cors());

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email", //replace with smtp server
  port: 587,
  auth: {
    user: dotenv.EMAIL,
    pass: dotenv.PASSWORD,
  },
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

function sanitizeFileName(fileName) {
  // Replace special characters with underscores
  let sanitizedName = fileName.replace(/[^a-zA-Z0-9\s-]/g, '_');

  // Remove leading/trailing whitespace and replace internal whitespace with underscores
  sanitizedName = sanitizedName.trim().replace(/\s+/g, '_');

  // Replace "-" with "_" for consistency
  sanitizedName = sanitizedName.replace(/-/g, '_');

  // Truncate the filename to 255 characters (a common filesystem limit)
  return sanitizedName.slice(0, 255);
}

app.post("/send", (req, res) => {
  const data = req.body;

  if (JSON.stringify(data) !== "{}") {
    const compCourses = Object.values(data["compulsory_courses"]);

    let optCourses = {};
    let rows_o = 0;
    let rows = 0;

    let ct = [];
    let samp = {};
    Object.entries(data["selected_courses"]).forEach(([key, value]) => {
      // Replace commas with a special character
      optCourses[value["catagory"].replaceAll(",", "\u2063")] = (value["courses"] || []).map(course => course.replaceAll(",", "\u2063"));
      for (const val of value["courses"]) {
        samp[val.replaceAll(",", "\u2063")] = value["catagory"].replaceAll(",", "\u2063");
        ct.push(val.replaceAll(",", "\u2063"));
      }
      rows_o += value["courses"].length;
    });

    ncomp = compCourses.length;

    if (rows_o < ncomp) {
      rows = ncomp;
    } else if (rows_o > ncomp) {
      rows = ncomp + (rows_o - ncomp);
    }

    let tempObj = [];
    for (let i = 0; i < rows; i++) {
      tempObj[i] = {
        student_name: i == 0 ? data["student_name"] : "",
        uun: i == 0 ? data["uun"] : "",
        programme_name:
          i == 0 ? data["course_name"] + " " + data["course_year"] : "",
        compulsory_courses: compCourses[i]?.replaceAll(",", "\u2063") || "",
        selected_courses: ct[i] || "",
      };
    }

    const fields = [
      "student_name",
      "uun",
      "programme_name",
      "compulsory_courses",
      "selected_courses",
    ];

    let csv = parser.parse(tempObj, { fields }, (includeEmptyRows = true));

    // Replace the special character back with commas
    csv = csv.replaceAll("\u2063", ",");

    // convert file name
    let degree = sanitizeFileName(data["course_name"]) + "_" + data["uun"];

    // clean data
    let teData = {
      student_name: data["student_name"],
      uun: data["uun"],
      programme_name: data["course_name"] + " " + data["course_year"],
      compulsory_courses: data["compulsory_courses"],
      selected_courses: data["selected_courses"],
    };

    if (
      data["student_name"] != "" &&
      data["uun"] != "" &&
      data["programme_name"] != "" &&
      data["compulsory_courses"] != {} &&
      data["selected_courses"] != {}
    ) {
      transporter.sendMail(
        {
          from: "student@example.com",
          to: "dep@example.com",
          subject: `${data["course_name"]} ${data["course_year"]} | ${data["uun"]} | ${data["student_name"]}`,
          text: `raw_data: ${JSON.stringify(teData)}`,
          html: "<b>PFA</b>",

          //here is the magic
          attachments: [
            {
              filename: `${degree}.csv`,
              content: csv,
            },
          ],
        },
        (err, info) => {
          if (err) {
            console.log("Error occurred: " + err.message);
            res.status(500).send("Error occurred!");
            // return process.exit(1);
          } else {
            console.log("Message sent: %s", info.messageId);

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            res.status(200).send({ url: nodemailer.getTestMessageUrl(info) });
          }
        }
      );
    } else {
      res.status(500).send("Empty fields");
    }
  } else {
    res.status(500).send("Empty");
  }
});

app.listen(port, () => console.log(`Express app running on port ${port}!`));
