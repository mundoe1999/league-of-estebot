const express = require('express');
var router = express.Router();

var app = express();
app.use(express.static(__dirname+"/client"));


router.get('/', (req,res) => {
  res.redirect("index.html");
});

app.listen(3000, () => console.log("Listening to Port 3000"));