let Calls = (function() {

    var favouriteDrinks = []

    function searchCocktailsImpl(searchInput) {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchInput)
            .then(response => response.json())
            .then(json => {

                var drinks = json.drinks;

                //Next line will clear complete div, so they don't append on next search...
                document.getElementById("resultsDiv").innerHTML = "";

                if (drinks == null) {
                    var noSearchResultDiv = generateErrorDiv("OOPS! We couldnt't find any drinks :(", "brokenSearch.png");
                    document.getElementById("resultsDiv").appendChild(noSearchResultDiv);
                } else if (searchInput == "") {
                    var noSearchInputDiv = generateErrorDiv("OOPS! Empty search :(", "brokenSearch.png");
                    document.getElementById("resultsDiv").appendChild(noSearchInputDiv);
                } else fillResultsDiv(drinks);
            })
    }

    function searchForCocktailsByIngredientImpl(searchInput) {

        fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + searchInput)
            .then(response => {
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json'))
                    return {
                        drinks: null
                    };

                return response.json();
            })
            .then(json => {

                var drinks = json.drinks;

                //Next line will clear complete div, so they don't append on next search...
                document.getElementById("resultsDiv").innerHTML = "";

                if (drinks == null && searchInput != "") {
                    var noSearchResultDiv = generateErrorDiv("OOPS! We couldnt't find any drinks with that ingredient :(", "brokenSearch.png");
                    document.getElementById("resultsDiv").appendChild(noSearchResultDiv);
                } else if (searchInput == "") {
                    var noSearchInputDiv = generateErrorDiv("OOPS! Empty search :(", "brokenSearch.png");
                    document.getElementById("resultsDiv").appendChild(noSearchInputDiv);
                } else {
                    var drinksWithSpecifiedIngredient = [];
                    const promises = drinks.map(drink =>
                        fetch("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drink.idDrink).then(response => response.json()).then(json => {
                            drinksWithSpecifiedIngredient.push(json.drinks[0]);
                        }));
                    Promise.all(promises).then(function(ok) {
                        fillResultsDiv(drinksWithSpecifiedIngredient);
                    });
                }

            })
    }

    function searchForFilteredDrinksImpl(searchInput, isAlcoholic) {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchInput)
            .then(response => response.json())
            .then(json => {

                var drinks = json.drinks;

                //Next line will clear complete div, so they don't append on next search...
                document.getElementById("resultsDiv").innerHTML = "";

                if (drinks == null) {
                    var alcoholicSign = "";
                    if (isAlcoholic) alcoholicSign = "alcoholic";
                    else alcoholicSign = "alcohol free";
                    var noSearchResultDiv = generateErrorDiv("OOPS! We couldnt't find any " + alcoholicSign + " drinks :(", "brokenSearch.png");
                    document.getElementById("resultsDiv").appendChild(noSearchResultDiv);
                } else if (searchInput == "") {
                    var noSearchInputDiv = generateErrorDiv("OOPS! Empty search :(", "brokenSearch.png");
                    document.getElementById("resultsDiv").appendChild(noSearchInputDiv);
                } else {
                    //1 is for alcoholic drinks, 0 is for alcohol free (isAlcoholic parameter value)
                    if (isAlcoholic) {
                        for (var i = 0; i < drinks.length; i++)
                            if (drinks[i].strAlcoholic != "Alcoholic") {
                                drinks.splice(i, 1);
                                i--;
                            }
                    } else {
                        for (var i = 0; i < drinks.length; i++)
                            if (drinks[i].strAlcoholic == "Alcoholic") {
                                drinks.splice(i, 1);
                                i--;
                            }
                    }
                    fillResultsDiv(drinks);
                }
            })
    }

    function listTenRandomCocktailsImpl() {

        //Next line will clear complete div, so they don't append on next search...
        document.getElementById("resultsDiv").innerHTML = "";

        // https://www.thecocktaildb.com/api/json/v1/1/random.php
        var randomDrinks = [];
        var cheatLoop = (new Array(10)).fill(0);
        const promises = cheatLoop.map(drink =>
            fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php").then(response => response.json()).then(json => {
                randomDrinks.push(json.drinks[0]);
            }));
        Promise.all(promises).then(function(ok) {
            fillResultsDiv(randomDrinks);
        });

    }

    function shakeCocktailImpl() {
        var shaker = document.getElementById("shaker");
        shaker.innerHTML = "";

        fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php').
        then(response => response.json()).
        then(json => {
            var drink = json.drinks[0];
            var drinkDiv = document.createElement("div");
            drinkDiv.setAttribute("id", "shakedCocktail");
            drinkDiv.style.setProperty("padding", "15px");
            drinkDiv.style.setProperty("background", "rgba(0, 0, 0, 0.2)");
            drinkDiv.style.setProperty("border-radius", "20px");

            var cocktailName = generateBarmansRecommandation(drink.strDrink);
            var alcoholAlertParagraph = generateAlcoholAlertParagraph(drink.strAlcoholic);
            var cocktailInfoDiv = generateCocktailInfoDiv(drink, false, "180", "200", 40, "15px");
            var addToFavouritesButtonDiv = generateButton(false);

            drinkDiv.appendChild(cocktailName);
            drinkDiv.appendChild(alcoholAlertParagraph);
            drinkDiv.appendChild(cocktailInfoDiv);
            drinkDiv.appendChild(addToFavouritesButtonDiv);



            var shakeButton = document.createElement("button");
            shakeButton.innerHTML = "SHAKE";
            shakeButton.setAttribute("id", "shakeButton");
            shakeButton.setAttribute("onclick", "shakeACocktail()");

            shaker.append(drinkDiv);
            shaker.append(shakeButton);
        });
    }

    function shakeAnotherCocktailImpl() {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php').
        then(response => response.json()).
        then(json => {
            var drink = json.drinks[0];
            var drinkDiv = document.getElementById("shakedCocktail");
            drinkDiv.innerHTML = "";
            var cocktailName = generateBarmansRecommandation(drink.strDrink);
            var alcoholAlertParagraph = generateAlcoholAlertParagraph(drink.strAlcoholic);
            var cocktailInfoDiv = generateCocktailInfoDiv(drink, false, "180", "200", "15px");
            var addToFavouritesButtonDiv = generateButton(false);

            drinkDiv.appendChild(cocktailName);
            drinkDiv.appendChild(alcoholAlertParagraph);
            drinkDiv.appendChild(cocktailInfoDiv);
            drinkDiv.appendChild(addToFavouritesButtonDiv);

        });
    }

    function writeFavouriteCocktailsFileImpl(jsonDrink, cellNotificationMessage) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
                if (response.alertMessage)
                    cellNotificationMessage.innerHTML = response.alertMessage;
                else
                    cellNotificationMessage.innerHTML = response.confirmedAdding;
                favouriteDrinks = response.favourites;
                console.log(favouriteDrinks);
            }
            if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("POST", "addFavourite", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({
            name: jsonDrink.name,
            isAlcoholic: jsonDrink.isAlcoholic,
            imageSource: jsonDrink.imageSource,
            description: jsonDrink.description,
            ingredients: jsonDrink.ingredients,
            measures: jsonDrink.measures
        }));



    }

    function loadFavouriteDrinksImpl() {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
                console.log(response);
                favouriteDrinks = response.favourites;
                fillFavouriteDrinksImpl();
            }
            if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("GET", "favs", true);
        ajax.send();
    }

    function fillFavouriteDrinksImpl() {
        var resultsDiv = document.getElementById("resultsDiv");

        for (var i = 0; i < favouriteDrinks.length; i++) {

            var drinkDiv = document.createElement("div");
            drinkDiv.style.padding = "30px";

            var cocktailName = generateCocktailName(favouriteDrinks[i].name);
            cocktailName.setAttribute("id", "cocktailName");
            cocktailName.setAttribute("contenteditable", "true");
            var alcoholic = "Alcoholic";
            if (!favouriteDrinks[i].isAlcoholic) alcoholic = "AlcoholFree";
            var alcoholAlertParagraph = generateAlcoholAlertParagraph(alcoholic);
            var additionDrinkInfo = {
                strDrinkThumb: favouriteDrinks[i].imageSource,
                strInstructions: favouriteDrinks[i].description,
            };
            for (var j = 0; j < favouriteDrinks[i].ingredients.length; j++) {
                additionDrinkInfo["strIngredient" + (j + 1).toString()] = favouriteDrinks[i].ingredients[j];
                if (favouriteDrinks[i].measures[j] != "undefined") additionDrinkInfo["strMeasure" + (j + 1).toString()] = favouriteDrinks[i].measures[j];
            }
            var cocktailInfoDiv = generateCocktailInfoDiv(additionDrinkInfo, true, "280", "320", 1000, "25px");
            var descriptionParagraph = cocktailInfoDiv.children[1].children[0];
            descriptionParagraph.setAttribute("id", "descriptionParagraph");
            descriptionParagraph.setAttribute("contenteditable", "true");
            descriptionParagraph.style.setProperty("padding", "10px");
            var editButton = generateButton(true);

            var ingredientsTable = cocktailInfoDiv.children[1].children[1];
            ingredientsTable.setAttribute("id", "ingredientsTableFavs");

            drinkDiv.appendChild(cocktailName);
            drinkDiv.appendChild(alcoholAlertParagraph);
            drinkDiv.appendChild(cocktailInfoDiv);
            drinkDiv.appendChild(editButton);

            if (i < favouriteDrinks.length - 1) {
                drinkDiv.style.borderBottom = "2px solid rgba(255,255,255,0.3)";
                drinkDiv.style.marginTop = "5px";
            }

            resultsDiv.appendChild(drinkDiv);

        }
    }

    function getFavouriteDrinksImpl() {
        return favouriteDrinks;
    }

    function saveChangesImpl(data) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
                favouriteDrinks = response.favourites;
            }
            if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("POST", "refreshFavourites", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({
            favourites: data
        }));
    }

    return {
        searchCocktails: searchCocktailsImpl,
        searchForCocktailsByIngredient: searchForCocktailsByIngredientImpl,
        searchForFilteredDrinks: searchForFilteredDrinksImpl,
        listTenRandomCocktails: listTenRandomCocktailsImpl,
        shakeCocktail: shakeCocktailImpl,
        shakeAnotherCocktail: shakeAnotherCocktailImpl,
        writeFavouriteCocktailsFile: writeFavouriteCocktailsFileImpl,
        loadFavouriteDrinks: loadFavouriteDrinksImpl,
        fillFavouriteDrinks: fillFavouriteDrinksImpl,
        getFavouriteDrinks: getFavouriteDrinksImpl,
        saveChanges: saveChangesImpl
    }

}())

function generateImage(src, width, height) {
    var image = document.createElement("img");
    image.src = src;
    image.width = width;
    image.height = height;
    return image;
}

function generateErrorDiv(message, imageSource) {

    var noSearchResultDiv = document.createElement("div");
    noSearchResultDiv.style.padding = "15px";
    noSearchResultDiv.style.textAlign = "center";

    var errorMessage = document.createElement("p");
    errorMessage.innerHTML = message;
    errorMessage.classList.add("wrongSearch");

    var errorImage = generateImage(imageSource, "200", "200");

    noSearchResultDiv.appendChild(errorMessage);
    noSearchResultDiv.appendChild(errorImage);
    return noSearchResultDiv;
}

function generateCocktailName(cocktailName) {
    var nameParagraph = document.createElement("p");
    nameParagraph.innerHTML = cocktailName.toUpperCase();
    nameParagraph.classList.add("drinkName");
    return nameParagraph;
}

function generateBarmansRecommandation(cocktailName) {
    var header = document.createElement("div");
    header.style.setProperty("display", "flex");

    var recommendedMessage = document.createElement("p");
    recommendedMessage.innerHTML = "RECOMMENDED";
    recommendedMessage.setAttribute("id", "recommendedMessage");

    var img = document.createElement("img");
    img.setAttribute("src", "star.png");
    img.setAttribute("id", "starImage");

    var nameParagraph = document.createElement("p");
    nameParagraph.innerHTML = cocktailName.toUpperCase();
    nameParagraph.classList.add("drinkName");



    header.appendChild(recommendedMessage);
    header.appendChild(img);
    header.appendChild(nameParagraph);
    return header;
}

function generateAlcoholAlertParagraph(alcoholSign) {
    var alcoholAlertParagraph = document.createElement("p");
    if (alcoholSign == "Alcoholic") {
        alcoholAlertParagraph.innerHTML = "ALCOHOLIC";
        alcoholAlertParagraph.classList.add("alcoholic");
    } else {
        alcoholAlertParagraph.innerHTML = "ALCOHOL FREE";
        alcoholAlertParagraph.classList.add("alcoholFree");
    }
    return alcoholAlertParagraph;
}

function generateButton(twoButtons) {
    var buttonDiv = document.createElement("div");
    if (twoButtons) {
        var saveButton = document.createElement("button");
        saveButton.setAttribute("id", "saveButton");
        saveButton.innerHTML = "SAVE";
        saveButton.setAttribute("onclick", "clickSaveButton()");
        saveButton.style.setProperty("margin", "10px");

        var cancelButton = document.createElement("button");
        cancelButton.setAttribute("id", "cancelEdittingButton");
        cancelButton.innerHTML = "CANCEL";
        cancelButton.setAttribute("onclick", "clickCancelButton(this.parentElement.parentElement)");
        cancelButton.style.setProperty("margin", "10px");


        buttonDiv.style.setProperty("width", "80vw");
        buttonDiv.style.setProperty("text-align", "center");
        buttonDiv.appendChild(saveButton);
        buttonDiv.appendChild(cancelButton);
    } else {
        var button = document.createElement("button");
        button.innerHTML = "ADD TO FAVOURITES";
        button.setAttribute("id", "addToFavourites");
        button.setAttribute("onclick", "clickAddToFavourites(this.parentElement.parentElement)");
        buttonDiv.appendChild(button);
    }
    return buttonDiv;
}

function generateCocktailInfoDiv(drink, isOnFavourite, imageWidth, imageHeight, breakSize, cocktailDescriptionParagraphFontSize) {
    var cocktailInfoDiv = document.createElement("div");
    cocktailInfoDiv.style.display = "inline-block";
    var cocktailImage = generateImage(drink.strDrinkThumb, imageWidth, imageHeight);
    cocktailImage.style.float = "left";

    var cocktailDescription = generateCocktailDescription(drink, isOnFavourite, breakSize, cocktailDescriptionParagraphFontSize);

    cocktailInfoDiv.appendChild(cocktailImage);
    cocktailInfoDiv.appendChild(cocktailDescription);
    return cocktailInfoDiv;
}

function generateCocktailDescription(drink, isOnFavourite, breakSize, cocktailDescriptionParagraphFontSize) {
    var cocktailDescription = document.createElement("p");
    if (isOnFavourite) cocktailDescription.style.setProperty("display", "flex");
    cocktailDescription.style.float = "left";
    cocktailDescription.style.color = "white";
    cocktailDescription.style.paddingLeft = "5px";

    var backSpaceMatched = false;
    var cocktailDescriptionParagraph = document.createElement("p");
    cocktailDescriptionParagraph.style.fontSize = cocktailDescriptionParagraphFontSize;
    for (var i = 0; i < drink.strInstructions.length; i++) {
        if (backSpaceMatched && drink.strInstructions[i] == ' ') {
            cocktailDescriptionParagraph.innerHTML += "<br>";
            backSpaceMatched = false;
        }
        if (i != 0 && i % breakSize == 0) {
            if (drink.strInstructions[i] == ' ')
                cocktailDescriptionParagraph.innerHTML += "<br>";
            else backSpaceMatched = true;
        }
        cocktailDescriptionParagraph.innerHTML += drink.strInstructions[i];
    }

    cocktailDescriptionParagraph.innerHTML += "<br>";
    cocktailDescriptionParagraph.innerHTML += "<br>";


    var ingredientsTable = document.createElement("table");
    ingredientsTable.id = "ingredientsTable";

    var counter = 1;
    while (drink["strIngredient" + counter.toString()] != null && drink["strIngredient" + counter.toString()] != "") {
        var row = ingredientsTable.insertRow(ingredientsTable.rows.length);

        var cellDrop = row.insertCell(0);
        var imageDrop = generateImage("drop.png", "20", "20");
        cellDrop.appendChild(imageDrop);

        var cellIngredient = row.insertCell(1);
        cellIngredient.setAttribute("contenteditable", "true");

        cellIngredient.innerHTML = drink["strIngredient" + counter.toString()];
        cellIngredient.style.fontWeight = "bold";
        var cellMeasure = row.insertCell(2);
        cellMeasure.setAttribute("contenteditable", "true");
        cellMeasure.innerHTML = "";
        if (drink["strMeasure" + counter.toString()] != null)
            cellMeasure.innerHTML = drink["strMeasure" + counter.toString()];


        counter++;
    }

    cocktailDescription.appendChild(cocktailDescriptionParagraph);
    cocktailDescription.appendChild(ingredientsTable);
    return cocktailDescription;
}

function fillResultsDiv(drinks) {
    var resultsDiv = document.getElementById("resultsDiv");
    for (var i = 0; i < drinks.length; i++) {
        var drinkDiv = document.createElement("div");
        drinkDiv.style.padding = "15px";

        var cocktailName = generateCocktailName(drinks[i].strDrink);
        var alcoholAlertParagraph = generateAlcoholAlertParagraph(drinks[i].strAlcoholic);
        var cocktailInfoDiv = generateCocktailInfoDiv(drinks[i], false, "180", "200", 40, "15px");
        var addToFavouritesButtonDiv = generateButton(false);

        drinkDiv.appendChild(cocktailName);
        drinkDiv.appendChild(alcoholAlertParagraph);
        drinkDiv.appendChild(cocktailInfoDiv);
        drinkDiv.appendChild(addToFavouritesButtonDiv);

        if (i < drinks.length - 1) {
            drinkDiv.style.borderBottom = "2px solid rgba(255,255,255,0.3)";
            drinkDiv.style.marginTop = "5px";
        }

        resultsDiv.appendChild(drinkDiv);

    }
    resultsDiv.style.overflowY = "auto";
    resultsDiv.style.height = "55vh";
}