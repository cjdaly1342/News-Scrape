// Dependencies
// =====================================================================================
var path = require('path');
var bodyParser = require('body-parser');
// Express
var express = require('express');
var app = express();
// Handlebars
var exphbs = require('express-handlebars');

// This will create main.handlebars
var hbs = exphbs.create({
	defaultLayout: 'main',
	// Helper function
	helpers: {
		addOne: function(value, options) {
			return parseInt(values) + 1;
		}
	}
});

// ====================================================================================
// Set Up View Engine
// ====================================================================================
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Sets up cheerio which is what really makes the scraping happen
// ====================================================================================
var request = require('request');
var cheerio = require('cheerio');

// Require Mongodb and Mongoose
// ====================================================================================
var mongoose = require('mongoose');
var ObjectId = require('mongojs').ObjectId;

// Mongo Database Config
// ====================================================================================
mongoose.connect('mongodb://localhost/scraper');
var db = mongoose.connection;

// Error functions
// ====================================================================================
db.on('error', function(err) {
	console.log(err);
});

// Start to Scrape Data when the App Starts
// ====================================================================================
var ScrapedData = require('./scrapedDataModel');

var options = {
	url: 'http://www.metalinjection.net/category/the-wednesday-sludge',
	headers: {
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
	}
};

request(options, function(error, response, html) {
	// Load the HTML body from request into cheerio
	var $ = cheerio.load(html);
	// 'new-content-block' class
	$('div.new-conent-block').each(function(i, element) {
		// Save the 'div' and 'a' tag
		var $a = $(this).children('a');
		var $div = $(this).children('div');
		// Save the article URL
		var articleURL = $a.attr('href');
		// Save the image URL of each element
		var imgURL = $a.children('img').attr('src');
		// Save the 'title' text
		var title = $div.children('h4').text();
		// Save the 'synopsis' text
		var synopsis = $div.children('p').text();
		// mongoose model
		var scrapedData = new ScrapedData({
			title: title,
			imgURL: imgURL,
			synopsis: synopsis,
			articleURL: articleURL
		});
		//Save the Data!
		scrapedData.save(function(err) {
			if (err) {
				console.log(err);
			}
			console.log('Saved');
		}); // End scrapedData.save(function(err)
	}); // End $('div.new-conent-block').each(function(i, element)
}); // End request(options, function(error, response, html)

app.use(bodyParser.urlencoded({
	extended: false
})); // End app.use(bodyParser.urlencoded({
app.use(express.static('public'));

// Main page route
app.get('/', function(req, res) {
	ScrapedData
	.findOne()
	.exec(function(err, data) {
		if (err) 
			return console.log(err);

		res.render('index', {
			imgURL: data.imgURL,
			title: data.title,
			synopsis: data.synopsis,
			_id: data._id,
			articleURL: data.articleURL,
			comments: data.comments
		}); // End res.render('index', { 
	}); // .exec(function(err, data) {
}); // End app.get('/', function(req, res) {

// Next data from database
app.get('/next/:id', function(req, res) {
	ScrapedData
		.find({
			_id: {$gt: req.params.id}
		})
		.sort({ _id: 1 })
		.limit(1)
		.exec(function(err, data) {
			if (err)
				return console.log(err);
			res.json(data)
		})
}); // End app.get('/next/:id', function(req, res) {

// Previous data from database
app.get('/prev/:id', function(req, res) {
	ScrapedData
		.find({
			_id: {$lt: req.params.id}
		})
		.sort({ _id: -1 })
		.limit(1)
		.exec(function(err, data) {
			if (err)
				return console.log(err);
			res.json(data);
		})
}); // End app.get('/prev/:id', function(req, res) {

// Add comment data to the database
app.post('/comment/:id', function(req, res) {
	ScrapedData.findByIdAndUpdate(
		req.params.id,
		{$push: {
			comments: {
				text: req.body.comment
			}
		}},
		{upsert: true, new: true},
		function(err, data) {
			if (err)
				return console.log(err);
			res.json(data.comments);
		}
	); // End ScrapedData.findByIdAndUpdate(
}); // End app.post('/comment/:id', function(req, res) {

// Remove comment data from the database
app.post('/remove/:id', function(req, res) {
	ScrapedData.findByIdAndUpdate(
		req.params.id,
		{$pull: {
			comments: {
				_id: req.body.id
			}
		}},
		{new: true},
		function(err, data) {
			if (err)
				return console.log(err);
			res.json(data.comments);
		}
	); // End ScrapedData.findByIdAndUpdate(
}); // End app.post('/remove/:id', function(req, res) {

// Listen on Port 3000
app.listen(3000, function() {
	console.log('App is Running on Port 3000');
}); // End app.listen(3000, function() {

