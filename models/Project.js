const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	technology: {
		type: String,
		required: true,
	},
	delivery_date: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	status:{
		type:String,
		required:true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Projects', ProjectSchema);
