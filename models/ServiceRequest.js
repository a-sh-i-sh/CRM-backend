const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
  projectId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	versionId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	milestoneId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  assigned: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
