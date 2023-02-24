const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
	name: {
		type: String,
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
	versions: {
		type: [mongoose.Schema.Types.ObjectId],
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

module.exports = mongoose.model('Project', projectSchema);
