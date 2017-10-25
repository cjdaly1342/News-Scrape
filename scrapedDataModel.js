// Dependencies
// ===================================================================================
// Mongoose
var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

// New Schema
// ===================================================================================
var ScrapedDataSchema = Schema({
	title: {
		type: String,
		required: true,
		unique: true
	},
	imgURL: {
		type: String,
		required: true
	},
	synopsis: {
		type: String,
		required: true
	},
	articleURL: {
		type: String,
		required: true
	},
	comments: [{
		text: {
			type: String
		}
	}] // End comments: [{
}); // End var ScrapedDataSchema = Schema({

// Schema to ScrapedDataModel
var ScrapedData = mongoose.model('ScrapedData', ScrapedDataSchema);

// Export this model 
module.exports = ScrapedData;