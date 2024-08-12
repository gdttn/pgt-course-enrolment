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
const port = dotenv.PORT;

// TODO: read this from .env
app.use(
  cors({
    origin: [
      "https://"+dotenv.HOSTNAME,
      "http://localhost",
      "http://localhost:8080",
    ],
  })
);

app.options("*", cors());

const transporter = nodemailer.createTransport({
  host: "", 
  port: 25,
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
    // send mail with defined transport object
    // todo, restore subject: `${data["course_name"]} ${data["course_year"]} | ${data["uun"]} | ${data["student_name"]}`,
    transporter.sendMail(
      {
        from: "Course Enrolment <"+dotenv.MAIL_FROM+">",
        to: dotenv.MAIL_TO,
        cc: dotenv.MAIL_CC,
        subject: "Informatics Course Enrolment Form Submission",
        text: "Please find submission below, and also attached.\n------\n"+JSON.stringify(teData),
        html: "<body>Please find attached.</body>",

          //here is the magic
          attachments: [
            {
              filename: `${degree}_${data["uun"]}.csv`,
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

const https = require("https");
const fs = require("fs");

// add our key (write env from config management)
https
  .createServer(
    {
      key: fs.readFileSync(dotenv.TLS_KEY),
      cert: fs.readFileSync(dotenv.TLS_CERT),
      ca: fs.readFileSync(dotenv.TLS_CA),
    },
    app
  )
  .listen(port, () => {
    console.log(`Express app running on port ${port}!`)
  });

//app.listen(port, () => console.log(`Express app running on port ${port}!`));
