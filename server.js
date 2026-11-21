const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("node:dns");

// Configure DNS before MongoDB connection
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const app = express();

// Import Student model
const Student = require("./models/Student");

// Configure EJS
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));

// Home route
app.get("/", function (req, res) {
  res.render("index");
});

// About route
app.get("/about", function (req, res) {
  res.render("about");
});

// Students route
app.get("/students", async function (req, res) {
  try {
    const students = await Student.find();

    res.render("students", {
      students: students,
    });
  } catch (error) {
    res.status(500).send("Error retrieving students");
  }
});

// Individual student details route
app.get("/students/:id", async function (req, res) {
  try {
    console.log("Individual student route accessed!");

    const studentId = req.params.id;

    const student = await Student.findOne({
      id: studentId,
    });

    if (student) {
      res.render("studentDetails", {
        student: student,
      });
    } else {
      res.status(404).send("Student not found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving student");
  }
});

// Results route
app.get("/results", async function (req, res) {
  try {
    const students = await Student.find();

    res.render("results", {
      students: students,
    });
  } catch (error) {
    res.status(500).send("Error retrieving results");
  }
});

// Search students by degree
app.get("/degree/:degree", async function (req, res) {
  try {
    const degreeName = req.params.degree;

    const filteredStudents = await Student.find({
      degree: degreeName,
    });

    res.render("degree", {
      students: filteredStudents,
      degree: degreeName,
    });
  } catch (error) {
    res.status(500).send("Error searching students");
  }
});

// Display registration form
app.get("/register", function (req, res) {
  res.render("register");
});

// Register a new student
app.post("/register", async function (req, res) {
  try {
    const newStudent = new Student({
      id: req.body.id.trim(),
      name: req.body.name.trim(),
      degree: req.body.degree,
      gpa: Number(req.body.gpa),
    });

    await newStudent.save();

    res.redirect("/students");
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send("Student ID already exists!");
    }

    console.error(error);
    res.status(500).send("Error registering student");
  }
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(function () {
    console.log("Connected to MongoDB successfully!");

    app.listen(process.env.PORT || 8080, function () {
      console.log("Server running on port 8080");
    });
  })
  .catch(function (error) {
    console.error("MongoDB connection failed:", error);
  });
