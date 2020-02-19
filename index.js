const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/public/home.html');
});

app.get("/ownersHiddenInfo", verifyToken, function(req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.json({
                message: 'You didn\'t get it :)'
            });
        } else {
            res.json({
                jmbg: '2408998170040',
                phonePasscode: '745377'
            });

        }
    })
});

app.post("/canYouGetIt", function(req, res) {
    var request = req.body;
    var password = request.password;
    if (password == "kjkszpj1337") {
        jwt.sign({ password: request.password }, 'secretkey', (err, token) => {
            res.json({
                token: token
            });
        });
    } else res.json({
        token: "wrongToken"
    });
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

        fs.writeFile('favourites.json', JSON.stringify(favsFile, null, 2), function(err) {
            if (err) throw err;
        });
        favsFile.confirmedAdding = "'" + request.name + "' ADDED TO FAVOURITES!";
        res.json(favsFile);

    });
});

app.post("/refreshFavourites", function(req, res) {
    var request = req.body;
    fs.writeFile('favourites.json', JSON.stringify(request, null, 2), function(err) {
        if (err) throw err;
    });
    res.json(request);
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader != 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.listen(3000);