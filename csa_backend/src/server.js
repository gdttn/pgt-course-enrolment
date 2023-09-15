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
      optCourses[value["catagory"]] = value["courses"] || [];
      for (const val of value["courses"]) {
        samp[val] = value["catagory"];
        ct.push(val);
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
        course_name: i == 0 ? data["course_name"] : "",
        course_year: i == 0 ? data["course_year"] : "",
        compulsory_courses: compCourses[i] || "",
        selected_courses: ct[i] || "",
      };
    }

    const fields = [
      "student_name",
      "uun",
      "course_name",
      "course_year",
      "compulsory_courses",
      "selected_courses",
    ];

    const csv = parser.parse(tempObj, { fields }, (includeEmptyRows = true));

    // convert file name
    let degree = data["course_name"].replace(/\s/g, "_");

    if (
      data["student_name"] != "" &&
      data["uun"] != "" &&
      data["course_name"] != "" &&
      data["course_year"] != "" &&
      data["compulsory_courses"] != {} &&
      data["selected_courses"] != {}
    ) {
      transporter.sendMail(
        {
          from: "student@example.com",
          to: "dep@example.com",
          subject: "New Form Submission",
          text: JSON.stringify(data),
          html: "<b>PFA</b>",

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

app.listen(port, () => console.log(`Express app running on port ${port}!`));