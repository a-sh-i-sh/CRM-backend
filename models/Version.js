const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	projectId: {
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
    milestones: {
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

module.exports = mongoose.model('Version', versionSchema);
