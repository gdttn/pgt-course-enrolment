<h1 align="center">
  Course Select Application
</h1>

## Development

To get a local copy of the code, clone it using git:

```
git clone https://github.com/dilinade/course-enrolment-app.git
```

### Backend Configuration and Running

To configure and run the backend application, navigate to the backend directory:

```
cd ./csa_backend
```

Install dependencies:

```
npm i
```

Before starting the backend, create a `.env` file with the following entries:

```
USER_NAME=<username>
EMAIL=<email@example.com>
PASSWORD=<password>
```

> **_NOTE:_** _You may need to create an account before proceeding. This example employs the use of the [Ethereal](https://ethereal.email/) Email fake SMTP service for testing email functionality. You might need to create an account on Ethereal Email before proceeding._

In the `./src/server.js` file, add the URL of the fronend to CORS:

```js
app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:8080",
    ],
  })
);
```

Initiate the backend server by running the following command:

```
node ./src/server.js
```
>

### Frontend Setup

To start the frontend application, navigate to the frontend directory:

```
cd ./csa_frontend
```

Install dependencies:

```
npm i
```

In the `./csa_frontend/src/components/ReviewModal.jsx` file, configure the backend server address:

```js
const B_URL = "http://csa_frontend:3001/send";
```

Start a local web server to run the frontend application:

```
npm run dev
```

And then open http://localhost:8080 (_Note: this may change depending on the configs of package.json_) to view it in the browser.

#### Available Scripts

In this project, you can run the following scripts:

| Script        | Description                                             |
| ------------- | ------------------------------------------------------- |
| npm start     | Runs the app in the development mode.                   |
| npm test      | Launches the test runner in the interactive watch mode. |
| npm run build | Builds the app for production to the `dist` folder.     |
| npm run serve | Serves the production build from the `dist` folder.     |
