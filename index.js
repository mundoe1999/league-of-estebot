const express = require('express');
var router = express.Router();
require('dotenv').config();

var app = express();
app.use(express.static(__dirname+"/client"));

//let questions = require('./client/json/result');

router.get('/questions', (req,res) => {

});
router.get('/', (req,res) => {
  res.redirect("index.html");
});

app.listen(process.env.PORT || 3000, () => console.log("Listening to Port 3000"));