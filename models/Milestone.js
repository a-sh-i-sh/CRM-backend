const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	projectId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	versionId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	assigned: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
    serviceRequests: {
		type: [mongoose.Schema.Types.ObjectId],
	},
	startDate: {
		type: Date,
		required: true,
	},
	dueDate: {
		type: Date,
		required: true,
	},
});

module.exports = mongoose.model('Milestone', milestoneSchema);
