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
	// versionId: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	required: true,
	// },
	assigned: {
		type: mongoose.Schema.Types.ObjectId,
	},
	status: {
		type: String,
		required: true,
	},
    data: {
		type: Array,
	},
	startDate: {
		type: Date,
		required: true,
	},
	dueDate: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Milestone', milestoneSchema);
