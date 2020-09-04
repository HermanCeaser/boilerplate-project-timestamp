// server.js
// where your node app starts

// init project
var express = require('express');
// const bodyParser = require('body-parser');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// Timestamp Api
app.get("/api/timestamp", (req, res) => {
  const date = new Date();
  res.json({"unix": date.getTime(), "utc": date.toUTCString()})
})
app.get("/api/timestamp/:date_string", function(req, res, next){
  const regexp = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
  let message = {};
  let date;
  const { date_string } = req.params
  switch(typeof date_string){
    case 'string':
      // Check If String is a unix TimeStamp
      if (/^(\d{0, 13})?$/.test(date_string)) {
        req.date = new Date(Number(date_string)); 
        break; // You forget this break
      }

      // Check if String is a Valid [yyyy-mm-dd] format
      if(regexp.test(date_string)){
        req.date = new Date(date_string);
      }else{
        message.error  = "Invalid Date";
      }
      break;
    case 'undefined':
      req.date = new Date();
    default:
      message.error = "Unknown Date String"
  }
  next(message);

}, (req, res) => {
  if(message.error){
    res.json({error: message.error})
  }
  res.json({"unix": req.date.getTime(), "utc": req.date.toUTCString()})
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});