var path = require("path");
var express = require("express");
var app = express();
var mongoose = require('mongoose');
var moment = require("moment");
var bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/static")));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');


var server = app.listen(8000, function() {
 console.log("listening on port 8000");
})


mongoose.connect('mongodb://localhost/quoting_dojo');
var QuoteSchema = new mongoose.Schema({
	name: String,
	quote: String,
	created_at: {type: String, default: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")}
})
var Quote = mongoose.model('Quote', QuoteSchema);


app.post('/quotes', function(req,res){
	console.log("POST DATA", req.body);

	var quote = new Quote({name: req.body.name, quote: req.body.quote});

	quote.save(function(err) {
		if(err) {
			console.log('something went wrong');
		}else{
			console.log('Successfully added a quote!')
			res.redirect('/quotes');
		}
	})
})
app.get("/quotes", function(req,res){
	Quote.find({}, function(err, quotes){
		if(err){
			console.log('nope');
		}else{
			console.log(quotes);
			res.render('quotes', {data:quotes});
		}
	})
})

app.get('/', function(req, res) {
   		res.render('index');
})

var route = require('./routes/index.js')(app, server, Quote);