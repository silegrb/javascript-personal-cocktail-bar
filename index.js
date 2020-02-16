const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/public/home.html');
});

app.get("/favs", function(req, res) {
    fs.readFile('favourites.json', (err, data) => {
        var favsFile = JSON.parse(data);
        res.json(favsFile);
    });
})

app.post("/addFavourite", function(req, res) {
    var request = req.body;
    fs.readFile('favourites.json', (err, data) => {
        var favsFile = JSON.parse(data);
        for (var i = 0; i < favsFile.favourites.length; i++) {
            var name = favsFile.favourites[i].name;
            if (request.name == name) {
                fs.writeFile('favourites.json', JSON.stringify(favsFile), function(err) {
                    if (err) throw err;
                });
                favsFile.alertMessage = "'" + request.name + "' ALREADY ADDED!";
                res.json(favsFile);
                return;
            }
        }


        favsFile.favourites.push({
            name: request.name,
            isAlcoholic: request.isAlcoholic,
            imageSource: request.imageSource,
            description: request.description,
            ingredients: request.ingredients,
            measures: request.measures
        });

        fs.writeFile('favourites.json', JSON.stringify(favsFile), function(err) {
            if (err) throw err;
        });
        favsFile.confirmedAdding = "'" + request.name + "' ADDED TO FAVOURITES!";
        res.json(favsFile);

    });
});

app.post("/refreshFavourites", function(req, res) {
    var request = req.body;
    fs.writeFile('favourites.json', JSON.stringify(request), function(err) {
        if (err) throw err;
    });
    res.json(JSON.stringify(request));
});

app.listen(3000);