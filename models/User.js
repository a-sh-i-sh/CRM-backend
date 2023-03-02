const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  gender: {
    type: String,
  },
  designation: {
    type: String,
  },
  // profilePic: {
  //   // type: File,
  //   required: true,
  // }
 
});
// userSchema.methods.addTasks = async function (task, assigned_by, status, estimateTime) {
//   try {
//     this.tasks = this.tasks.concat({ task, assigned_by, status, estimateTime });
//     await this.save();
//     return this.tasks;
//   } catch (error) {
//     console.log(error);
//   }
// }

module.exports = mongoose.model("User", userSchema);
