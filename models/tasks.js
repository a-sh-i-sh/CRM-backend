const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema( {
    user_id:{
        type:String,
        required:true
    },
    task: {
      type: String,
      required: true,
    },
    assigned_by: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    estimateTime: {
      type: Number,
      required: true,
    },
  });

module.exports = mongoose.model('Tasks', taskSchema);
