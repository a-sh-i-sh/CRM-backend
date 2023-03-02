const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
require("dotenv").config();

const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const leadsRoute = require("./routes/leads");
const contactsRoute = require("./routes/contacts");
const serviceRequestsRoute = require("./routes/serviceRequests");
const statsRoute = require("./routes/stats");
const tasks = require("./routes/tasks");
const completedProject = require("./routes/completedProject");

const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN;
const DB_HOST = process.env.DB_HOST;
// const DB_HOST = "mongodb://localhost:27017/CRM";

mongoose.connect(
  DB_HOST,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB");
  }
);

//  Create Admin
authRoute.createAdmin();

// configure express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(cors());
app.use(bodyParser.json())
app.use(helmet());
app.use("/api/auth", authRoute.router);
app.use("/api/users/employee", usersRoute);
app.use("/api/tasks", tasks);
app.use("/api/completedprojects", completedProject);
app.use("/api/contacts", contactsRoute);
app.use("/api/serviceRequests", serviceRequestsRoute);
app.use("/api/stats", statsRoute);

app.get("/", (req, res) => {
  res.send("Welcome to CRM Application!!!");
});

app.listen(PORT, () => {
  console.log("Server up and listening on port " + PORT);
});
