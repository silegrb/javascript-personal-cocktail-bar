let Calls = (function() {

    var favouriteDrinks = [];

    function searcForCocktailsImpl(searchInput) {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchInput)
            .then(response => response.json())
            .then(json => {

                var drinks = json.drinks;
                var searchResultsDiv = document.getElementById("searchResultsDiv");
                //Next line will clear complete div, so they don't append on next search...
                searchResultsDiv.innerHTML = "";

                if (drinks == null) {
                    var noSearchResultDiv = generateErrorDiv("OOPS! We couldnt't find any drinks :(", "brokenSearch.png");
                    searchResultsDiv.appendChild(noSearchResultDiv);
                } else if (searchInput == "") {
                    var noSearchInputDiv = generateErrorDiv("OOPS! Empty search :(", "brokenSearch.png");
                    searchResultsDiv.appendChild(noSearchInputDiv);
                } else fillSearchResultsDiv(drinks);
            });
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
                document.getElementById("searchResultsDiv").innerHTML = "";

                if (drinks == null && searchInput != "") {
                    var noSearchResultDiv = generateErrorDiv("OOPS! We couldnt't find any drinks with that ingredient :(", "brokenSearch.png");
                    document.getElementById("searchResultsDiv").appendChild(noSearchResultDiv);
                } else if (searchInput == "") {
                    var noSearchInputDiv = generateErrorDiv("OOPS! Empty search :(", "brokenSearch.png");
                    document.getElementById("searchResultsDiv").appendChild(noSearchInputDiv);
                } else {
                    var drinksWithSpecifiedIngredient = [];
                    const promises = drinks.map(drink =>
                        fetch("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drink.idDrink).then(response => response.json()).then(json => {
                            drinksWithSpecifiedIngredient.push(json.drinks[0]);
                        }));
                    Promise.all(promises).then(function(ok) {
                        fillSearchResultsDiv(drinksWithSpecifiedIngredient);
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
                document.getElementById("searchResultsDiv").innerHTML = "";

                if (drinks == null) {
                    var alcoholicSign = "";
                    if (isAlcoholic) alcoholicSign = "alcoholic";
                    else alcoholicSign = "alcohol free";
                    var noSearchResultDiv = generateErrorDiv("OOPS! We couldnt't find any " + alcoholicSign + " drinks :(", "brokenSearch.png");
                    document.getElementById("searchResultsDiv").appendChild(noSearchResultDiv);
                } else if (searchInput == "") {
                    var noSearchInputDiv = generateErrorDiv("OOPS! Empty search :(", "brokenSearch.png");
                    document.getElementById("searchResultsDiv").appendChild(noSearchInputDiv);
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
                    fillSearchResultsDiv(drinks);
                }
            })
    }

    function listTenRandomCocktailsImpl() {

        //Next line will clear complete div, so they don't append on next search...
        document.getElementById("searchResultsDiv").innerHTML = "";

        // https://www.thecocktaildb.com/api/json/v1/1/random.php
        var randomDrinks = [];
        var cheatLoop = (new Array(10)).fill(0);
        const promises = cheatLoop.map(drink =>
            fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php").then(response => response.json()).then(json => {
                randomDrinks.push(json.drinks[0]);
            }));
        Promise.all(promises).then(function(ok) {
            fillSearchResultsDiv(randomDrinks);
        });

    }

    function shakeCocktailImpl() {
        var shaker = document.getElementById("shakeComponent");
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
            var cocktailInfoDiv = generateCocktailInfoDiv(drink, false, "180", "200", 40, "15px", false);
            var addToFavouritesButtonDiv = generateButton(false);

            drinkDiv.appendChild(cocktailName);
            drinkDiv.appendChild(alcoholAlertParagraph);
            drinkDiv.appendChild(cocktailInfoDiv);
            drinkDiv.appendChild(addToFavouritesButtonDiv);



            var shakeButton = document.createElement("button");
            shakeButton.innerHTML = "SHAKE";
            shakeButton.setAttribute("id", "shakeButton");
            shakeButton.setAttribute("onclick", "clickShakeButton()");

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
            var cocktailInfoDiv = generateCocktailInfoDiv(drink, false, "180", "200", "15px", false);
            var addToFavouritesButtonDiv = generateButton(false);

            drinkDiv.appendChild(cocktailName);
            drinkDiv.appendChild(alcoholAlertParagraph);
            drinkDiv.appendChild(cocktailInfoDiv);
            drinkDiv.appendChild(addToFavouritesButtonDiv);

        });
    }

    function writeFavouriteCocktailsFileImpl(jsonFavouriteDrink, cellNotificationMessage) {
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
            name: jsonFavouriteDrink.name,
            isAlcoholic: jsonFavouriteDrink.isAlcoholic,
            imageSource: jsonFavouriteDrink.imageSource,
            description: jsonFavouriteDrink.description,
            ingredients: jsonFavouriteDrink.ingredients,
            measures: jsonFavouriteDrink.measures
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
        var resultsDiv = document.getElementById("favouriteDrinksDiv");
        resultsDiv.innerHTML = "";

        for (var i = 0; i < favouriteDrinks.length; i++) {

            var drinkDiv = document.createElement("div");
            drinkDiv.style.padding = "30px";

            var cocktailName = generateCocktailNameWithDeleteButton(favouriteDrinks[i].name);
            cocktailName.style.setProperty("display", "flex");
            cocktailName.children[0].setAttribute("id", "favouriteDrinkTitle");
            cocktailName.children[0].setAttribute("contenteditable", "true");
            var cancelButton = document.createElement("button");
            cancelButton.setAttribute("id", "removeFavouriteDrinkButton");
            cancelButton.setAttribute("onclick", "clickDeleteFavouriteCocktail(this.parentElement.parentElement)");
            var cancelImage = document.createElement("img");
            cancelImage.setAttribute("src", "cancel.png");
            cancelImage.setAttribute("id", "cancelIcon");
            cancelImage.style.setProperty("width", "50px");
            cancelImage.style.setProperty("height", "50px");
            cancelImage.style.setProperty("display", "inline-block");


            cancelButton.appendChild(cancelImage);
            cocktailName.appendChild(cancelButton);


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
            var cocktailInfoDiv = generateCocktailInfoDiv(additionDrinkInfo, true, "280", "320", 1000, "25px", true);
            var descriptionParagraph = cocktailInfoDiv.children[1].children[0];
            descriptionParagraph.setAttribute("id", "descriptionParagraph");
            descriptionParagraph.setAttribute("contenteditable", "true");
            descriptionParagraph.style.setProperty("padding", "10px");
            var editButton = generateButton(true);

            var ingredientsTable = cocktailInfoDiv.children[1].children[1];
            ingredientsTable.setAttribute("id", "favouriteIngredientsTable");

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
        searcForCocktails: searcForCocktailsImpl,
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

    var errorDiv = document.createElement("div");
    errorDiv.setAttribute("id", "errorDiv");

    var errorMessage = document.createElement("p");
    errorMessage.setAttribute("id", "wrongSearch")
    errorMessage.innerHTML = message;

    var errorImage = generateImage(imageSource, "200", "200");

    errorDiv.appendChild(errorMessage);
    errorDiv.appendChild(errorImage);

    return errorDiv;
}

function generateCocktailName(cocktailName) {
    var nameParagraph = document.createElement("p");
    nameParagraph.innerHTML = cocktailName;
    nameParagraph.classList.add("drinkTitle");
    return nameParagraph;
}

function generateCocktailNameWithDeleteButton(cocktailName) {
    var titleDiv = document.createElement("div");
    var nameParagraph = document.createElement("p");
    nameParagraph.innerHTML = cocktailName;
    nameParagraph.classList.add("drinkTitle");
    titleDiv.appendChild(nameParagraph);
    return titleDiv;
}

function generateBarmansRecommandation(cocktailName) {
    var header = document.createElement("div");
    header.style.setProperty("display", "flex");

    var recommendedMessage = document.createElement("p");
    recommendedMessage.innerHTML = "RECOMMENDED";
    recommendedMessage.setAttribute("id", "recommendedMessage");

    var img = document.createElement("img");
    img.setAttribute("src", "star.png");
    img.setAttribute("id", "starIcon");

    var nameParagraph = document.createElement("p");
    nameParagraph.innerHTML = cocktailName;
    nameParagraph.classList.add("drinkTitle");



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
        button.setAttribute("id", "addToFavouritesButton");
        button.setAttribute("onclick", "clickAddToFavouritesButton(this.parentElement.parentElement)");
        buttonDiv.appendChild(button);
    }
    return buttonDiv;
}

function generateCocktailInfoDiv(drink, isOnFavourite, imageWidth, imageHeight, breakSize, cocktailDescriptionParagraphFontSize, favouriteDrinksTable) {
    var cocktailInfoDiv = document.createElement("div");
    cocktailInfoDiv.style.display = "inline-block";
    var cocktailImage = generateImage(drink.strDrinkThumb, imageWidth, imageHeight);
    cocktailImage.style.float = "left";

    var cocktailDescription = generateCocktailDescription(drink, isOnFavourite, breakSize, cocktailDescriptionParagraphFontSize, favouriteDrinksTable);

    cocktailInfoDiv.appendChild(cocktailImage);
    cocktailInfoDiv.appendChild(cocktailDescription);
    return cocktailInfoDiv;
}

function generateCocktailDescription(drink, isOnFavourite, breakSize, cocktailDescriptionParagraphFontSize, favouriteDrinksTable) {
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

    if (favouriteDrinksTable) {
        var headerDrop = document.createElement("th");

        var wrapperDiv = document.createElement("div");
        wrapperDiv.style.setProperty("display", "flex");
        var dropImage = document.createElement("img");
        dropImage.setAttribute("src", "drop.png");
        dropImage.style.setProperty("width", "30px");
        dropImage.style.setProperty("height", "30px");
        dropImage.style.setProperty("margin-left", "10px");

        var ingredientsHeader = document.createElement("p");
        ingredientsHeader.innerHTML = "Ingredients";
        ingredientsHeader.style.setProperty("margin-top", "0.3em");

        wrapperDiv.appendChild(dropImage);
        wrapperDiv.appendChild(ingredientsHeader);
        headerDrop.appendChild(wrapperDiv);

        var headerAdd = document.createElement("th");
        headerAdd.setAttribute("colspan", "2");
        var addButton = generateButton(false);
        addButton.innerHTML = "ADD";
        addButton.setAttribute("id", "addIngredientButton");
        addButton.setAttribute("onclick", "clickAddIngredientButton(this.parentElement.parentElement)");
        headerAdd.appendChild(addButton);
        ingredientsTable.appendChild(headerDrop);
        ingredientsTable.appendChild(headerAdd);
    }
    while (drink["strIngredient" + counter.toString()] != null && drink["strIngredient" + counter.toString()] != "") {
        var row = ingredientsTable.insertRow(ingredientsTable.rows.length);
        if (!favouriteDrinksTable) {
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
        } else {

            var cellIngredient = row.insertCell(0);
            cellIngredient.setAttribute("contenteditable", "true");

            cellIngredient.innerHTML = drink["strIngredient" + counter.toString()];
            cellIngredient.style.fontWeight = "bold";
            var cellMeasure = row.insertCell(1);
            cellMeasure.setAttribute("contenteditable", "true");
            cellMeasure.innerHTML = "";
            if (drink["strMeasure" + counter.toString()] != null)
                cellMeasure.innerHTML = drink["strMeasure" + counter.toString()];
            var cellDeleteRow = row.insertCell(2);
            var deleteRowButton = document.createElement("button");
            deleteRowButton.setAttribute("id", "removeFavouriteDrinkButton");
            deleteRowButton.style.setProperty("width", "25px");
            deleteRowButton.style.setProperty("height", "25px");
            deleteRowButton.setAttribute("onclick", "clickDeleteRowButton(this.parentElement.parentElement)");

            var cancelImage = document.createElement("img");
            cancelImage.setAttribute("src", "cancel.png");
            cancelImage.style.setProperty("width", "25px");
            cancelImage.style.setProperty("height", "25px");

            deleteRowButton.appendChild(cancelImage);
            cellDeleteRow.appendChild(deleteRowButton);
        }
        counter++;
    }

    cocktailDescription.appendChild(cocktailDescriptionParagraph);
    cocktailDescription.appendChild(ingredientsTable);
    return cocktailDescription;
}

function fillSearchResultsDiv(drinks) {
    var resultsDiv = document.getElementById("searchResultsDiv");
    for (var i = 0; i < drinks.length; i++) {
        var drinkDiv = document.createElement("div");
        drinkDiv.style.padding = "15px";

        var cocktailName = generateCocktailName(drinks[i].strDrink);
        var alcoholAlertParagraph = generateAlcoholAlertParagraph(drinks[i].strAlcoholic);
        var cocktailInfoDiv = generateCocktailInfoDiv(drinks[i], false, "180", "200", 40, "15px", false);
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