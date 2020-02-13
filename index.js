const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/",function(req,res){        
	res.sendFile(__dirname + '/public/home.html' );
});

app.listen(3000);