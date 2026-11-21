const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  degree: {
    type: String,
    required: true,
  },

  gpa: {
    type: Number,
    required: true,
    min: 0,
    max: 4,
  },
});

// Create Student model
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
